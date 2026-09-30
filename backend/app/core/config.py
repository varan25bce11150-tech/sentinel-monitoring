from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel Monitoring"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "development_secret_key_change_in_production"
    
    # Database Settings
    POSTGRES_USER: str = "sentinel"
    POSTGRES_PASSWORD: str = "sentinel_pass"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "sentinel_db"
    DATABASE_URL: str = "postgresql+asyncpg://sentinel:sentinel_pass@localhost:5432/sentinel_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()