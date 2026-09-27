"""Zira3i AI backend: keeps the NVIDIA key server-side and exposes the agronomy doctor to the app."""

import base64
import binascii
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .config import Settings, load_settings
from .diagnosis import DiagnosisService
from .nim_client import NimAuthError, NimClient, NimError
from .schemas import DiagnoseRequest, DiagnoseResponse, ErrorResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("zira3i")


def create_app(settings: Settings | None = None, nim: NimClient | None = None) -> FastAPI:
    settings = settings or load_settings()
    nim = nim or NimClient(settings)
    service = DiagnosisService(settings, nim)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        if not nim.configured:
            log.warning("NVIDIA_API_KEY is not set: /api/v1/diagnose will return 503 and the app will use its offline knowledge base")
        yield
        await nim.aclose()

    app = FastAPI(title="Zira3i AI Backend", version="1.0.0", lifespan=lifespan)

    def error(status: int, code: str, detail: str = "") -> JSONResponse:
        return JSONResponse(status_code=status, content=ErrorResponse(error=code, detail=detail).model_dump())

    @app.get("/health")
    async def health():
        return {
            "status": "ok",
            "aiConfigured": nim.configured,
            "textModels": settings.text_models,
            "visionModels": settings.vision_models,
        }

    @app.post(
        "/api/v1/diagnose",
        response_model=DiagnoseResponse,
        responses={400: {"model": ErrorResponse}, 502: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
    )
    async def diagnose(req: DiagnoseRequest):
        if not req.prompt.strip() and not req.imageBase64:
            return error(400, "empty_request", "Provide a prompt and/or an image")
        if req.imageBase64:
            if len(req.imageBase64) > settings.max_image_b64_chars:
                return error(413, "image_too_large", f"Base64 image must be under {settings.max_image_b64_chars} chars")
            try:
                base64.b64decode(req.imageBase64, validate=True)
            except (binascii.Error, ValueError):
                return error(400, "invalid_image", "imageBase64 is not valid base64")

        try:
            result = await service.diagnose(req)
        except NimAuthError as e:
            log.error("AI provider auth/config error: %s", e)
            return error(503, "ai_unavailable", str(e))
        except NimError as e:
            log.error("AI provider error: %s", e)
            return error(502, "ai_error", str(e))

        log.info(
            "diagnose lang=%s image=%s model=%s crop=%r confidence=%d",
            req.language, bool(req.imageBase64), result.model, result.report.cropName, result.report.confidenceScore,
        )
        return result

    return app


app = create_app()
