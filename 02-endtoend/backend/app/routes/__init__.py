from .auth import router as auth_router
from .problems import router as problems_router
from .interviews import router as interviews_router

__all__ = [
    "auth_router",
    "problems_router",
    "interviews_router",
]
