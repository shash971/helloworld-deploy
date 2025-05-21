from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/summary")
def get_report_summary():
    try:
        # Example static report data (can be replaced with real-time aggregation later)
        summary = {
            "sales_report": {
                "total_sales": 152,
                "total_amount": 1250000,
                "top_selling_item": "Gold Ring"
            },
            "purchase_report": {
                "total_purchases": 97,
                "total_spent": 880000,
                "top_vendor": "Rajasthan Gold Traders"
            },
            "profit": {
                "gross_profit": 370000,
                "margin_percent": 29.6
            }
        }
        return summary

    except Exception as e:
        return {"error": str(e)}
