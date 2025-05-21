from pydantic import BaseModel
from datetime import date


class SaleBase(BaseModel):
    date: date
    customer_name: str
    item_description: str
    quantity: int
    rate: float
    amount: float


class SaleCreate(SaleBase):
    pass


class Sale(SaleBase):
    id: int

    class Config:
        orm_mode = True
