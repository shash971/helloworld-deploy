from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from schemas.igi_receive import IGIReceiveCreate, IGIReceiveOut
import crud.igi_receive as crud

router = APIRouter(
    prefix="/igi-receive",
    tags=["IGI Receive"]
)

@router.get("/", response_model=list[IGIReceiveOut])
def read_igi_receives(db: Session = Depends(get_db)):
    return crud.get_all_igi(db)

@router.get("/{receive_id}", response_model=IGIReceiveOut)
def read_igi_receive(receive_id: int, db: Session = Depends(get_db)):
    entry = crud.get_igi(db, receive_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.post("/", response_model=IGIReceiveOut)
def create_igi_receive(entry: IGIReceiveCreate, db: Session = Depends(get_db)):
    return crud.create_igi(db, entry)

@router.put("/{receive_id}", response_model=IGIReceiveOut)
def update_igi_receive(receive_id: int, entry: IGIReceiveCreate, db: Session = Depends(get_db)):
    updated = crud.update_igi(db, receive_id, entry)
    if not updated:
        raise HTTPException(status_code=404, detail="Entry not found")
    return updated

@router.delete("/{receive_id}")
def delete_igi_receive(receive_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_igi(db, receive_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Deleted successfully"}
