from sqlalchemy.orm import Session
from models.igi_receive_model import IGIReceive
from schemas.igi_receive import IGIReceiveCreate

def get_all_igi(db: Session):
    return db.query(IGIReceive).all()

def get_igi(db: Session, receive_id: int):
    return db.query(IGIReceive).filter(IGIReceive.id == receive_id).first()

def create_igi(db: Session, entry: IGIReceiveCreate):
    new_entry = IGIReceive(**entry.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def update_igi(db: Session, receive_id: int, entry: IGIReceiveCreate):
    igi = db.query(IGIReceive).filter(IGIReceive.id == receive_id).first()
    if igi:
        for key, value in entry.dict().items():
            setattr(igi, key, value)
        db.commit()
        db.refresh(igi)
    return igi

def delete_igi(db: Session, receive_id: int):
    igi = db.query(IGIReceive).filter(IGIReceive.id == receive_id).first()
    if igi:
        db.delete(igi)
        db.commit()
    return igi
