from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from models.igi_issue_model import IGIIssueCreate, IGIIssue
from models.db_models import IGIIssue as IGIIssueModel

router = APIRouter(prefix="/igi-issue", tags=["IGI Issue"])

@router.post("/", response_model=IGIIssue)
def create_entry(data: IGIIssueCreate, db: Session = Depends(get_db)):
    entry = IGIIssueModel(**data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/", response_model=list[IGIIssue])
def get_all(db: Session = Depends(get_db)):
    return db.query(IGIIssueModel).all()

@router.get("/{issue_id}", response_model=IGIIssue)
def get_entry(issue_id: int, db: Session = Depends(get_db)):
    entry = db.query(IGIIssueModel).filter(IGIIssueModel.id == issue_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Record not found")
    return entry

@router.put("/{issue_id}", response_model=IGIIssue)
def update_entry(issue_id: int, data: IGIIssueCreate, db: Session = Depends(get_db)):
    entry = db.query(IGIIssueModel).filter(IGIIssueModel.id == issue_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Record not found")
    for key, value in data.dict().items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{issue_id}")
def delete_entry(issue_id: int, db: Session = Depends(get_db)):
    entry = db.query(IGIIssueModel).filter(IGIIssueModel.id == issue_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(entry)
    db.commit()
    return {"detail": "Record deleted successfully"}
