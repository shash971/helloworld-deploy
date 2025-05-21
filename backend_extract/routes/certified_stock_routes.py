from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.certified_stock_model import CertifiedStockCreate, CertifiedStock
from config.db import get_db
from models.db_models import CertifiedStock as CertifiedStockModel

router = APIRouter(prefix="/certified-stock", tags=["Certified Stock"])

@router.post("/", response_model=CertifiedStock)
def create_certified_stock(entry: CertifiedStockCreate, db: Session = Depends(get_db)):
    record = CertifiedStockModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[CertifiedStock])
def get_all_certified_stock(db: Session = Depends(get_db)):
    return db.query(CertifiedStockModel).all()

@router.get("/{stock_id}", response_model=CertifiedStock)
def get_certified_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(CertifiedStockModel).filter(CertifiedStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Certified stock not found")
    return record

@router.put("/{stock_id}", response_model=CertifiedStock)
def update_certified_stock(stock_id: int, updated: CertifiedStockCreate, db: Session = Depends(get_db)):
    record = db.query(CertifiedStockModel).filter(CertifiedStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Certified stock not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{stock_id}")
def delete_certified_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(CertifiedStockModel).filter(CertifiedStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Certified stock not found")
    db.delete(record)
    db.commit()
    return {"detail": "Certified stock deleted successfully"}
