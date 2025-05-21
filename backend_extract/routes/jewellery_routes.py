# routes/jewellery_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from crud import jewellery
from schemas.jewellery import JewelleryItemCreate, JewelleryItemOut, JewelleryItemUpdate

router = APIRouter(prefix="/jewellery", tags=["Jewellery Management"])

@router.post("/", response_model=JewelleryItemOut)
def create_jewellery_item(data: JewelleryItemCreate, db: Session = Depends(get_db)):
    return jewellery.create_jewellery(db, data)

@router.get("/", response_model=list[JewelleryItemOut])
def list_all(db: Session = Depends(get_db)):
    return jewellery.get_all_jewellery(db)

@router.get("/{item_id}", response_model=JewelleryItemOut)
def get_one(item_id: int, db: Session = Depends(get_db)):
    item = jewellery.get_jewellery_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Jewellery item not found")
    return item

@router.put("/{item_id}", response_model=JewelleryItemOut)
def update_item(item_id: int, data: JewelleryItemUpdate, db: Session = Depends(get_db)):
    return jewellery.update_jewellery(db, item_id, data)

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    jewellery.delete_jewellery(db, item_id)
    return {"detail": "Deleted"}
