from pydantic import BaseModel
from typing import Optional
from datetime import date

class IGIIssueBase(BaseModel):
    date: date
    item: Optional[str]
    pcs: Optional[int]
    gross_wt: Optional[float]
    net_wt: Optional[float]
    rate: Optional[float]
    amount: Optional[float]
    remark: Optional[str]

class IGIIssueCreate(IGIIssueBase):
    pass

class IGIIssue(IGIIssueBase):
    id: int

    class Config:
        orm_mode = True
