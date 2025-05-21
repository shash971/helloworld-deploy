from pydantic import BaseModel
from typing import Optional
from datetime import date

class StockTransferBase(BaseModel):
    date: date
    from_branch: Optional[str]
    to_branch: Optional[str]
    iteam: Optional[str]
    shape: Optional[str]
    size: Optional[str]
    total: Optional[float]
    remark: Optional[str]

class StockTransferCreate(StockTransferBase):
    pass

class StockTransfer(StockTransferBase):
    id: int

    class Config:
        orm_mode = True
