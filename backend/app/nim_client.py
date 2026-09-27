"""Thin async client for NVIDIA NIM's OpenAI-compatible chat completions API,
with ordered model fallback (NIM retires models regularly, e.g. HTTP 410 Gone)."""

import logging
import re

import httpx

from .config import Settings

log = logging.getLogger("zira3i.nim")

# Status codes where trying the next model in the list is worthwhile.
_RETRY_NEXT_MODEL = {404, 410, 422, 429, 500, 502, 503, 504}
_THINK_BLOCK = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


class NimError(Exception):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


class NimAuthError(NimError):
    pass


class NimClient:
    def __init__(self, settings: Settings, transport: httpx.AsyncBaseTransport | None = None):
        self._settings = settings
        self._http = httpx.AsyncClient(
            base_url=settings.nvidia_base_url,
            timeout=httpx.Timeout(settings.request_timeout_s, connect=10.0),
            transport=transport,
        )

    @property
    def configured(self) -> bool:
        return bool(self._settings.nvidia_api_key)

    async def aclose(self) -> None:
        await self._http.aclose()

    async def chat(self, models: list[str], messages: list[dict], temperature: float = 0.2) -> tuple[str, str]:
        """Returns (content, model_used). Raises NimError when every model failed."""
        if not self.configured:
            raise NimAuthError("NVIDIA API key is not configured (set NVIDIA_API_KEY)")

        last_error: NimError | None = None
        for model in models:
            try:
                resp = await self._http.post(
                    "/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self._settings.nvidia_api_key}",
                        "Accept": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": temperature,
                        "top_p": 0.9,
                        "max_tokens": self._settings.max_tokens,
                        "stream": False,
                    },
                )
            except httpx.HTTPError as e:
                log.warning("NIM transport error on %s: %s", model, e)
                last_error = NimError(f"{model}: {type(e).__name__}")
                continue

            if resp.status_code in (401, 403):
                # Bad key: no point trying other models.
                raise NimAuthError("NVIDIA rejected the API key", resp.status_code)
            if resp.status_code in _RETRY_NEXT_MODEL:
                log.warning("NIM %s returned %s: %s", model, resp.status_code, resp.text[:200])
                last_error = NimError(f"{model}: HTTP {resp.status_code}", resp.status_code)
                continue
            if resp.status_code != 200:
                raise NimError(f"{model}: HTTP {resp.status_code} {resp.text[:200]}", resp.status_code)

            try:
                content = resp.json()["choices"][0]["message"]["content"] or ""
            except (ValueError, KeyError, IndexError, TypeError):
                last_error = NimError(f"{model}: malformed response")
                continue
            content = _THINK_BLOCK.sub("", content).strip()
            if content:
                return content, model
            last_error = NimError(f"{model}: empty response")

        raise last_error or NimError("no models configured")
