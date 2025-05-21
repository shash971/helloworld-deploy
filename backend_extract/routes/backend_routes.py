from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth import get_current_user
from models.user_model import User

router = APIRouter(prefix="/backend", tags=["Backend"])

@router.get("/summary")
def get_backend_summary(current_user: User = Depends(get_current_user)):
    if current_user.role != "Backend":
        raise HTTPException(status_code=403, detail="Backend role required")
    
    return {
        "message": f"Backend summary for {current_user.username}",
        "system_status": "All systems operational",
        "tasks_pending": 7
    }
