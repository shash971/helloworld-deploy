from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.jewellery_stock_model import JewelleryStockCreate, JewelleryStock
from config.db import get_db
from models.db_models import JewelleryStock as JewelleryStockModel

router = APIRouter(prefix="/jewellery-stock", tags=["Jewellery Stock"])

@router.post("/", response_model=JewelleryStock)
def create_stock(entry: JewelleryStockCreate, db: Session = Depends(get_db)):
    record = JewelleryStockModel(**entry.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[JewelleryStock])
def get_all_stocks(db: Session = Depends(get_db)):
    return db.query(JewelleryStockModel).all()

@router.get("/{stock_id}", response_model=JewelleryStock)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(JewelleryStockModel).filter(JewelleryStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Jewellery stock not found")
    return record

@router.put("/{stock_id}", response_model=JewelleryStock)
def update_stock(stock_id: int, updated: JewelleryStockCreate, db: Session = Depends(get_db)):
    record = db.query(JewelleryStockModel).filter(JewelleryStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Jewellery stock not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    record = db.query(JewelleryStockModel).filter(JewelleryStockModel.id == stock_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Jewellery stock not found")
    db.delete(record)
    db.commit()
    return {"detail": "Jewellery stock deleted successfully"}
