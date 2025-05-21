from pydantic import BaseModel
from typing import Optional
from datetime import date

class JewelleryStockBase(BaseModel):
    date: date
    item: Optional[str]
    gross_wt: Optional[float]
    net_wt: Optional[float]
    purity: Optional[str]
    type: Optional[str]
    value: Optional[float]
    remark: Optional[str]

class JewelleryStockCreate(JewelleryStockBase):
    pass

class JewelleryStock(JewelleryStockBase):
    id: int

    class Config:
        orm_mode = True
