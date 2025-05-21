import pandas as pd
import psycopg2
from datetime import datetime

# Load Excel
df = pd.read_excel("dashboard_data.xlsx", sheet_name="Sheet1")
df.fillna('', inplace=True)  # Replace NaN with empty string

# Helper to safely parse date
def parse_date(val):
    try:
        if isinstance(val, datetime):
            return val.date()
        return pd.to_datetime(val).date()
    except:
        return None

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="finance_db",
    user="postgres",
    password="Finance123"
)
cur = conn.cursor()

# =================== SALES ===================
sales_data = df.iloc[1, 0:16].tolist()
sales_date = parse_date(sales_data[0])
if sales_date:
    sales_data[0] = sales_date
    cur.execute("""
        INSERT INTO sales (
            sale_date, customer, item, shape, size, color, clarity, pcs, lab_no,
            rate, total, term, currency, pay_mode, sales_exec, remark
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, sales_data)
    print("✅ Sales row inserted.")
else:
    print("⚠️ Sales row skipped due to invalid date.")

# =================== PURCHASE ===================
purchase_data = df.iloc[4, 0:16].tolist()
purchase_date = parse_date(purchase_data[0])
if purchase_date:
    purchase_data[0] = purchase_date
    cur.execute("""
        INSERT INTO purchases (
            purchase_date, vendor, item, shape, size, color, clarity, pcs, lab_no,
            rate, total, term, currency, pay_mode, purchase_exec, remark
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, purchase_data)
    print("✅ Purchase row inserted.")
else:
    print("⚠️ Purchase row skipped due to invalid date.")

# =================== EXPENSE ===================
expense_data = df.iloc[7, 0:10].tolist()
expense_date = parse_date(expense_data[0])
if expense_date:
    expense_data[0] = expense_date
    cur.execute("""
        INSERT INTO expenses (
            expense_date, party, item, pcs, rate, total, term, currency, pay_mode, remark
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, expense_data)
    print("✅ Expense row inserted.")
else:
    print("⚠️ Expense row skipped due to invalid date.")

# Finalize
conn.commit()
cur.close()
conn.close()
print("✅ All valid rows imported successfully.")
