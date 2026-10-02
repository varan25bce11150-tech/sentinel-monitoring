from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import secrets

router = APIRouter()

# Schema models
class SystemSettings(BaseModel):
    project_name: str = "Sentinel Monitoring"
    alert_email: EmailStr = "admin@sentinel.local"
    slack_webhook_url: Optional[str] = "https://hooks.slack.com/services/xxx/yyy/zzz"
    discord_webhook_url: Optional[str] = ""
    ping_interval_seconds: int = 60
    timeout_seconds: int = 10
    cpu_threshold_percent: int = 85
    memory_threshold_percent: int = 90
    enable_email_alerts: bool = True
    enable_webhook_alerts: bool = True

class APIKeyItem(BaseModel):
    id: str
    name: str
    key_prefix: str
    created_at: str
    last_used: str

class GenerateAPIKeyRequest(BaseModel):
    name: str

class GenerateAPIKeyResponse(BaseModel):
    id: str
    name: str
    api_key: str

# In-memory mock persistent store
_settings_store = SystemSettings()
_api_keys_store = [
    APIKeyItem(
        id="key-1",
        name="Production Agent 01",
        key_prefix="snt_live_8f3a...",
        created_at="2026-01-15 10:30:00",
        last_used="2 mins ago"
    )
]

@router.get("", response_model=SystemSettings)
@router.get("/", response_model=SystemSettings)
async def get_settings():
    return _settings_store

@router.put("", response_model=SystemSettings)
@router.put("/", response_model=SystemSettings)
async def update_settings(payload: SystemSettings):
    global _settings_store
    _settings_store = payload
    return _settings_store

@router.get("/api-keys", response_model=List[APIKeyItem])
@router.get("/api-keys/", response_model=List[APIKeyItem])
async def list_api_keys():
    return _api_keys_store

@router.post("/api-keys", response_model=GenerateAPIKeyResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api-keys/", response_model=GenerateAPIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(payload: GenerateAPIKeyRequest):
    raw_key = f"snt_live_{secrets.token_hex(16)}"
    key_id = f"key-{secrets.token_hex(4)}"
    
    new_item = APIKeyItem(
        id=key_id,
        name=payload.name,
        key_prefix=f"{raw_key[:12]}...",
        created_at="Just now",
        last_used="Never"
    )
    _api_keys_store.append(new_item)
    
    return GenerateAPIKeyResponse(
        id=key_id,
        name=payload.name,
        api_key=raw_key
    )

@router.delete("/api-keys/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
@router.delete("/api-keys/{key_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key(key_id: str):
    global _api_keys_store
    _api_keys_store = [k for k in _api_keys_store if k.id != key_id]
    return None