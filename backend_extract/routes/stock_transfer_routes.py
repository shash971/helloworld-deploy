from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.stock_transfer_model import StockTransferCreate, StockTransfer
from config.db import get_db
from models.db_models import StockTransfer as StockTransferModel

router = APIRouter(prefix="/stock-transfer", tags=["Stock Transfer"])

@router.post("/", response_model=StockTransfer)
def create_stock_transfer(entry: StockTransferCreate, db: Session = Depends(get_db)):
    record = StockTransferModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[StockTransfer])
def get_all_stock_transfers(db: Session = Depends(get_db)):
    return db.query(StockTransferModel).all()

@router.get("/{transfer_id}", response_model=StockTransfer)
def get_stock_transfer(transfer_id: int, db: Session = Depends(get_db)):
    record = db.query(StockTransferModel).filter(StockTransferModel.id == transfer_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    return record

@router.put("/{transfer_id}", response_model=StockTransfer)
def update_stock_transfer(transfer_id: int, updated: StockTransferCreate, db: Session = Depends(get_db)):
    record = db.query(StockTransferModel).filter(StockTransferModel.id == transfer_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{transfer_id}")
def delete_stock_transfer(transfer_id: int, db: Session = Depends(get_db)):
    record = db.query(StockTransferModel).filter(StockTransferModel.id == transfer_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    db.delete(record)
    db.commit()
    return {"detail": "Stock transfer deleted successfully"}
