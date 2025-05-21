# models/jewellery_model.py

from sqlalchemy import Column, Integer, String, Date, Numeric
from config.db import Base

class JewelleryItem(Base):
    __tablename__ = "jewellery_items"

    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String, unique=True, nullable=False)
    description = Column(String)
    purity = Column(String)
    weight = Column(Numeric(10, 2))
    status = Column(String)  # Example: in_stock, sold, memo_out, etc.
    last_updated = Column(Date)
    remarks = Column(String)
