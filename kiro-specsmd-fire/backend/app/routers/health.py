"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/api/health")
def health_check():
    """Health check — returns 200 if the service is running."""
    return {"status": "ok", "service": "friccion-cero-api"}
