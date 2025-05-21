# schemas/jewellery.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class JewelleryItemBase(BaseModel):
    item_code: str
    description: Optional[str]
    purity: Optional[str]
    weight: Optional[float]
    status: Optional[str]
    last_updated: Optional[date]
    remarks: Optional[str]

class JewelleryItemCreate(JewelleryItemBase):
    pass

class JewelleryItemUpdate(JewelleryItemBase):
    pass

class JewelleryItemOut(JewelleryItemBase):
    id: int

    class Config:
        orm_mode = True
