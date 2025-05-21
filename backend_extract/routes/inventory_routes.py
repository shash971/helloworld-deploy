from fastapi import APIRouter

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)

@router.get("/summary")
def get_inventory_summary():
    try:
        # Placeholder logic; in a real setup, fetch from DB or services
        inventory_summary = {
            "loose_stock_items": 120,
            "certified_stock_items": 85,
            "jewellery_stock_items": 42,
            "stock_transfers": 18,
            "total_items": 120 + 85 + 42
        }
        return inventory_summary

    except Exception as e:
        return {"error": str(e)}
