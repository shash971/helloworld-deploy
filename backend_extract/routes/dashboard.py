from fastapi import APIRouter, Depends
from dependencies.auth import get_current_user
from models.user_model import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/secure-data")
def get_protected_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Welcome, {current_user.username}!",
        "role": current_user.role
    }
