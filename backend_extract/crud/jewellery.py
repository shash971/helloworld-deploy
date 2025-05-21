# crud/jewellery.py

from sqlalchemy.orm import Session
from models.jewellery_model import JewelleryItem
from schemas.jewellery import JewelleryItemCreate, JewelleryItemUpdate

def create_jewellery(db: Session, data: JewelleryItemCreate):
    item = JewelleryItem(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_all_jewellery(db: Session):
    return db.query(JewelleryItem).all()

def get_jewellery_by_id(db: Session, item_id: int):
    return db.query(JewelleryItem).filter(JewelleryItem.id == item_id).first()

def update_jewellery(db: Session, item_id: int, update_data: JewelleryItemUpdate):
    item = get_jewellery_by_id(db, item_id)
    if item:
        for key, value in update_data.dict().items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

def delete_jewellery(db: Session, item_id: int):
    item = get_jewellery_by_id(db, item_id)
    if item:
        db.delete(item)
        db.commit()
    return item
