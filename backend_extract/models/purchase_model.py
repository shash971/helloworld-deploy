from pydantic import BaseModel
from typing import Optional
from datetime import date

class PurchaseBase(BaseModel):
    date: date
    vendor: Optional[str]
    iteam: Optional[str]
    shape: Optional[str]
    size: Optional[str]
    col: Optional[str]
    clr: Optional[str]
    pcs: Optional[int]
    lab_no: Optional[str]
    rate: Optional[float]
    total: Optional[float]
    term: Optional[str]
    currency: Optional[str]
    pay_mode: Optional[str]
    purchase_executive: Optional[str]
    remark: Optional[str]

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    id: int

    class Config:
        orm_mode = True
