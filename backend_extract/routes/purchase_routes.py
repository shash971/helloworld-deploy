from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.purchase_model import PurchaseCreate, Purchase
from config.db import get_db
from models.db_models import Purchase as PurchaseModel

router = APIRouter(prefix="/purchase", tags=["Purchase"])

@router.post("/", response_model=Purchase)
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = PurchaseModel(**purchase.dict())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.get("/", response_model=list[Purchase])
def get_all_purchases(db: Session = Depends(get_db)):
    return db.query(PurchaseModel).all()

@router.get("/{purchase_id}", response_model=Purchase)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(PurchaseModel).filter(PurchaseModel.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase

@router.put("/{purchase_id}", response_model=Purchase)
def update_purchase(purchase_id: int, updated: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = db.query(PurchaseModel).filter(PurchaseModel.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    for key, value in updated.dict().items():
        setattr(purchase, key, value)
    db.commit()
    db.refresh(purchase)
    return purchase

@router.delete("/{purchase_id}")
def delete_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(PurchaseModel).filter(PurchaseModel.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    db.delete(purchase)
    db.commit()
    return {"detail": "Purchase deleted successfully"}
