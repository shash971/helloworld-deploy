from pydantic import BaseModel

class JewellerySummary(BaseModel):
    total_items: int
    total_value: float
    note: str
