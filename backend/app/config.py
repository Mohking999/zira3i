"""Runtime configuration, read once from environment variables (or backend/.env)."""

import os
from dataclasses import dataclass, field
from pathlib import Path


def _load_dotenv() -> None:
    """Minimal .env loader so we don't need python-dotenv. Real env vars win."""
    env_file = Path(__file__).resolve().parent.parent / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip().removeprefix("export ").strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def _csv(name: str, default: str) -> list[str]:
    return [m.strip() for m in os.getenv(name, default).split(",") if m.strip()]


@dataclass(frozen=True)
class Settings:
    # NVIDIA_API_KEY is the canonical name; ZIRA3I_API_KEY is accepted for the team's existing setup.
    nvidia_api_key: str = ""
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    # Tried in order; the next one is used if a model is retired (404/410) or overloaded (429/5xx).
    text_models: list[str] = field(default_factory=list)
    vision_models: list[str] = field(default_factory=list)
    request_timeout_s: float = 60.0
    max_tokens: int = 2048
    # NIM rejects inline images above ~180 KB of base64; the app compresses below this.
    max_image_b64_chars: int = 180_000


def load_settings() -> Settings:
    _load_dotenv()
    return Settings(
        nvidia_api_key=os.getenv("NVIDIA_API_KEY") or os.getenv("ZIRA3I_API_KEY", ""),
        nvidia_base_url=os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/"),
        text_models=_csv(
            "ZIRA3I_TEXT_MODELS",
            "mistralai/mistral-large-2-instruct,nvidia/llama-3.1-nemotron-70b-instruct,google/gemma-3-12b-it",
        ),
        vision_models=_csv(
            "ZIRA3I_VISION_MODELS",
            "meta/llama-3.2-90b-vision-instruct,meta/llama-3.2-11b-vision-instruct",
        ),
        request_timeout_s=float(os.getenv("ZIRA3I_TIMEOUT_S", "60")),
        max_tokens=int(os.getenv("ZIRA3I_MAX_TOKENS", "2048")),
    )
