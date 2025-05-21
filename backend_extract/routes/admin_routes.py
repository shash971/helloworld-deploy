from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies.auth import admin_required
from models.user_model import User
from config.db import get_db

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users")
def list_users(current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "username": u.username, "role": u.role} for u in users]
