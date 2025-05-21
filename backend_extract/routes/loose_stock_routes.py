from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.loose_stock_model import LooseStockCreate, LooseStock
from config.db import get_db
from models.db_models import LooseStock as LooseStockModel

router = APIRouter(prefix="/loose-stock", tags=["Loose Stock"])

@router.post("/", response_model=LooseStock)
def create_loose_stock(entry: LooseStockCreate, db: Session = Depends(get_db)):
    record = LooseStockModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[LooseStock])
def get_all_loose_stock(db: Session = Depends(get_db)):
    return db.query(LooseStockModel).all()

@router.get("/{stock_id}", response_model=LooseStock)
def get_loose_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(LooseStockModel).filter(LooseStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Loose stock not found")
    return record

@router.put("/{stock_id}", response_model=LooseStock)
def update_loose_stock(stock_id: int, updated: LooseStockCreate, db: Session = Depends(get_db)):
    record = db.query(LooseStockModel).filter(LooseStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Loose stock not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{stock_id}")
def delete_loose_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(LooseStockModel).filter(LooseStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Loose stock not found")
    db.delete(record)
    db.commit()
    return {"detail": "Loose stock deleted successfully"}
