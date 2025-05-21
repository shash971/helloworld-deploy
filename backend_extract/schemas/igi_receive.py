from pydantic import BaseModel
from datetime import date

class IGIReceiveBase(BaseModel):
    receive_date: date
    item_name: str
    shape: str
    weight: str
    lab_name: str
    certificate_no: str
    remark: str

class IGIReceiveCreate(IGIReceiveBase):
    pass

class IGIReceiveOut(IGIReceiveBase):
    id: int

    class Config:
        orm_mode = True
