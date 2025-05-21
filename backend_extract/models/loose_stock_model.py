from pydantic import BaseModel
from typing import Optional
from datetime import date

class LooseStockBase(BaseModel):
    date: date
    branch: Optional[str]
    iteam: Optional[str]
    shape: Optional[str]
    size: Optional[str]
    total: Optional[float]
    remark: Optional[str]

class LooseStockCreate(LooseStockBase):
    pass

class LooseStock(LooseStockBase):
    id: int

    class Config:
        orm_mode = True
