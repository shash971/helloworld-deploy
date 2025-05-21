from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter(
    prefix="/jewellery-management",
    tags=["Jewellery Management"]
)

# Path to your Excel file
EXCEL_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'dashboard_data.xlsx')

@router.get("/summary")
def get_jewellery_summary():
    try:
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name="Sheet1")
        jewellery_rows = df[df['AREA'].str.contains("jewel", case=False, na=False)]

        summary = {
            "total_modules": len(jewellery_rows),
            "modules": jewellery_rows[['AREA', 'REQUIRED DETAILS']].fillna("").to_dict(orient="records")
        }
        return summary

    except FileNotFoundError:
        return {"error": f"Excel file not found at {EXCEL_FILE_PATH}"}
    except Exception as e:
        return {"error": str(e)}
