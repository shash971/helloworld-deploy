from pydantic import BaseModel
from typing import Optional
from datetime import date

class SalesBase(BaseModel):
    date: date
    customer: Optional[str]
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
    sales_executive: Optional[str]
    remark: Optional[str]

class SalesCreate(SalesBase):
    pass

class Sales(SalesBase):
    id: int

    class Config:
        orm_mode = True
