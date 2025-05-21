from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.memo_give_model import MemoGiveCreate, MemoGive
from config.db import get_db
from models.db_models import MemoGive as MemoGiveModel

router = APIRouter(prefix="/memo-give", tags=["Memo Give"])

@router.post("/", response_model=MemoGive)
def create_memo(entry: MemoGiveCreate, db: Session = Depends(get_db)):
    record = MemoGiveModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[MemoGive])
def get_all_memos(db: Session = Depends(get_db)):
    return db.query(MemoGiveModel).all()

@router.get("/{memo_id}", response_model=MemoGive)
def get_memo(memo_id: int, db: Session = Depends(get_db)):
    record = db.query(MemoGiveModel).filter(MemoGiveModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    return record

@router.put("/{memo_id}", response_model=MemoGive)
def update_memo(memo_id: int, updated: MemoGiveCreate, db: Session = Depends(get_db)):
    record = db.query(MemoGiveModel).filter(MemoGiveModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{memo_id}")
def delete_memo(memo_id: int, db: Session = Depends(get_db)):
    record = db.query(MemoGiveModel).filter(MemoGiveModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    db.delete(record)
    db.commit()
    return {"detail": "Memo deleted successfully"}
