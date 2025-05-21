from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.sales_model import SalesCreate, Sales
from config.db import get_db
from models.db_models import Sales as SalesModel

from dependencies.auth import get_current_user
from models.user_model import User

router = APIRouter(prefix="/sales", tags=["Sales"])

# Create sale
@router.post("/", response_model=Sales)
def create_sale(sale: SalesCreate, db: Session = Depends(get_db)):
    db_sale = SalesModel(**sale.dict())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

# Get all sales
@router.get("/", response_model=list[Sales])
def get_sales(db: Session = Depends(get_db)):
    return db.query(SalesModel).all()

# Get sale by ID
@router.get("/{sale_id}", response_model=Sales)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(SalesModel).filter(SalesModel.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

# Update sale
@router.put("/{sale_id}", response_model=Sales)
def update_sale(sale_id: int, updated: SalesCreate, db: Session = Depends(get_db)):
    db_sale = db.query(SalesModel).filter(SalesModel.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in updated.dict().items():
        setattr(db_sale, key, value)
    db.commit()
    db.refresh(db_sale)
    return db_sale

# Protected summary
@router.get("/summary")
def get_sales_summary(current_user: User = Depends(get_current_user)):
    if current_user.role != "Sales":
        raise HTTPException(status_code=403, detail="Sales role required")
    return {
        "message": f"Sales summary for {current_user.username}",
        "sales_data": {"total_orders": 42, "revenue": 9000}
    }
