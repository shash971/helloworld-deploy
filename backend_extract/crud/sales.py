from sqlalchemy.orm import Session
from models.sales import Sale
from schemas.sales import SaleCreate


def get_all_sales(db: Session):
    return db.query(Sale).all()


def create_sale(db: Session, sale: SaleCreate):
    db_sale = Sale(
        date=sale.date,
        customer_name=sale.customer_name,
        item_description=sale.item_description,
        quantity=sale.quantity,
        rate=sale.rate,
        amount=sale.amount,
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale


def get_sale(db: Session, sale_id: int):
    return db.query(Sale).filter(Sale.id == sale_id).first()


def delete_sale(db: Session, sale_id: int):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if sale:
        db.delete(sale)
        db.commit()
    return sale


def update_sale(db: Session, sale_id: int, updated_sale: SaleCreate):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        return None

    sale.date = updated_sale.date
    sale.customer_name = updated_sale.customer_name
    sale.item_description = updated_sale.item_description
    sale.quantity = updated_sale.quantity
    sale.rate = updated_sale.rate
    sale.amount = updated_sale.amount

    db.commit()
    db.refresh(sale)
    return sale
