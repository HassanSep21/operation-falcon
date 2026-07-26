from app.db import Database

print("Connecting to Neo4j...")

db = Database()

try:
    message = db.test_connection()
    print(f"✓ {message}")
finally:
    db.close()
    