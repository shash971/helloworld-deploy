from pydantic import BaseModel
from typing import Optional
from datetime import date

class ExpenseBase(BaseModel):
    date: date
    party: Optional[str]
    iteam: Optional[str]
    pcs: Optional[int]
    rate: Optional[float]
    total: Optional[float]
    term: Optional[str]
    currency: Optional[str]
    pay_mode: Optional[str]
    remark: Optional[str]

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int

    class Config:
        orm_mode = True
