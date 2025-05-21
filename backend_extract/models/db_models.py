from sqlalchemy import Column, Integer, String, Date, Numeric
from config.db import Base  # ✅ FIXED: import from correct path

class Sales(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    customer = Column(String)
    iteam = Column(String)
    shape = Column(String)
    size = Column(String)
    col = Column(String)
    clr = Column(String)
    pcs = Column(Integer)
    lab_no = Column(String)
    rate = Column(Numeric(10, 2))
    total = Column(Numeric(12, 2))
    term = Column(String)
    currency = Column(String)
    pay_mode = Column(String)
    sales_executive = Column(String)
    remark = Column(String)

class Purchase(Base):
    __tablename__ = "purchase"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    vendor = Column(String)
    iteam = Column(String)
    shape = Column(String)
    size = Column(String)
    col = Column(String)
    clr = Column(String)
    pcs = Column(Integer)
    lab_no = Column(String)
    rate = Column(Numeric(10, 2))
    total = Column(Numeric(12, 2))
    term = Column(String)
    currency = Column(String)
    pay_mode = Column(String)
    purchase_executive = Column(String)
    remark = Column(String)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    party = Column(String)
    iteam = Column(String)
    pcs = Column(Integer)
    rate = Column(Numeric(10, 2))
    total = Column(Numeric(12, 2))
    term = Column(String)
    currency = Column(String)
    pay_mode = Column(String)
    remark = Column(String)

class LooseStock(Base):
    __tablename__ = "loose_stock"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    branch = Column(String)
    iteam = Column(String)
    shape = Column(String)
    size = Column(String)
    total = Column(Numeric(12, 2))
    remark = Column(String)

class CertifiedStock(Base):
    __tablename__ = "certified_stock"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    certi_no = Column(String)
    lab = Column(String)
    shape = Column(String)
    size = Column(String)
    color = Column(String)
    clarity = Column(String)
    rate = Column(Numeric(10, 2))
    total = Column(Numeric(12, 2))
    currency = Column(String)
    pay_mode = Column(String)
    remark = Column(String)

class StockTransfer(Base):
    __tablename__ = "stock_transfer"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    from_branch = Column(String)
    to_branch = Column(String)
    iteam = Column(String)
    shape = Column(String)
    size = Column(String)
    total = Column(Numeric(12, 2))
    remark = Column(String)

class JewelleryStock(Base):
    __tablename__ = "jewellery_stock"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    item = Column(String)
    gross_wt = Column(Numeric(10, 2))
    net_wt = Column(Numeric(10, 2))
    purity = Column(String)
    type = Column(String)
    value = Column(Numeric(12, 2))
    remark = Column(String)

class MemoGive(Base):
    __tablename__ = "memo_give"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    client_name = Column(String)
    item = Column(String)
    gross_wt = Column(Numeric(10, 2))
    net_wt = Column(Numeric(10, 2))
    purity = Column(String)
    rate = Column(Numeric(10, 2))
    amount = Column(Numeric(12, 2))
    remark = Column(String)

class MemoTake(Base):
    __tablename__ = "memo_take"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    client_name = Column(String)
    item = Column(String)
    gross_wt = Column(Numeric(10, 2))
    net_wt = Column(Numeric(10, 2))
    purity = Column(String)
    rate = Column(Numeric(10, 2))
    amount = Column(Numeric(12, 2))
    remark = Column(String)

class IGIIssue(Base):
    __tablename__ = "igi_issue"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    item = Column(String)
    pcs = Column(Integer)
    gross_wt = Column(Numeric(10, 2))
    net_wt = Column(Numeric(10, 2))
    rate = Column(Numeric(10, 2))
    amount = Column(Numeric(12, 2))
    remark = Column(String)
