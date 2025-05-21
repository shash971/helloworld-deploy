from pydantic import BaseModel
from typing import Optional
from datetime import date

class MemoTakeBase(BaseModel):
    date: date
    client_name: Optional[str]
    item: Optional[str]
    gross_wt: Optional[float]
    net_wt: Optional[float]
    purity: Optional[str]
    rate: Optional[float]
    amount: Optional[float]
    remark: Optional[str]

class MemoTakeCreate(MemoTakeBase):
    pass

class MemoTake(MemoTakeBase):
    id: int

    class Config:
        orm_mode = True
