import sqlite3
import os

db_path = os.path.join("backend", "plant_disease.db")
try:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("DELETE FROM predictions WHERE disease LIKE '%Person%';")
    conn.commit()
    print(f"Deleted {c.rowcount} invalid records.")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
