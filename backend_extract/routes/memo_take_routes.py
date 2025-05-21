from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from models.memo_take_model import MemoTakeCreate, MemoTake
from models.db_models import MemoTake as MemoTakeModel

router = APIRouter(prefix="/memo-take", tags=["Memo Take"])

@router.post("/", response_model=MemoTake)
def create_memo(entry: MemoTakeCreate, db: Session = Depends(get_db)):
    record = MemoTakeModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[MemoTake])
def get_all_memos(db: Session = Depends(get_db)):
    return db.query(MemoTakeModel).all()

@router.get("/{memo_id}", response_model=MemoTake)
def get_memo(memo_id: int, db: Session = Depends(get_db)):
    record = db.query(MemoTakeModel).filter(MemoTakeModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    return record

@router.put("/{memo_id}", response_model=MemoTake)
def update_memo(memo_id: int, updated: MemoTakeCreate, db: Session = Depends(get_db)):
    record = db.query(MemoTakeModel).filter(MemoTakeModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{memo_id}")
def delete_memo(memo_id: int, db: Session = Depends(get_db)):
    record = db.query(MemoTakeModel).filter(MemoTakeModel.id == memo_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Memo not found")
    db.delete(record)
    db.commit()
    return {"detail": "Memo deleted successfully"}
