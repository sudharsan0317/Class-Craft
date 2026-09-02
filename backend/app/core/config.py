import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("APP_NAME", "Class Craft API")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    ]

settings = Settings()
