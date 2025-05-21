from sqlalchemy import Column, Integer, String, Date
from config.db import Base

class IGIReceive(Base):
    __tablename__ = "igi_receive"

    id = Column(Integer, primary_key=True, index=True)
    receive_date = Column(Date, nullable=False)
    item_name = Column(String)
    shape = Column(String)
    weight = Column(String)
    lab_name = Column(String)
    certificate_no = Column(String)
    remark = Column(String)
