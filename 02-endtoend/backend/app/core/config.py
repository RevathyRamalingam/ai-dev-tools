from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""
    app_name: str = "Coding Interview Platform"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./interview.db"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
    ]
    
    # Redis (for caching and sessions)
    redis_url: str = "redis://localhost:6379/0"
    
    # Code execution
    max_execution_time: int = 30  # seconds
    max_memory: int = 512  # MB
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
