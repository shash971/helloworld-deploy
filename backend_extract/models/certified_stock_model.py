from pydantic import BaseModel
from typing import Optional
from datetime import date

class CertifiedStockBase(BaseModel):
    date: date
    certi_no: Optional[str]
    lab: Optional[str]
    shape: Optional[str]
    size: Optional[str]
    color: Optional[str]
    clarity: Optional[str]
    rate: Optional[float]
    total: Optional[float]
    currency: Optional[str]
    pay_mode: Optional[str]
    remark: Optional[str]

class CertifiedStockCreate(CertifiedStockBase):
    pass

class CertifiedStock(CertifiedStockBase):
    id: int

    class Config:
        orm_mode = True
