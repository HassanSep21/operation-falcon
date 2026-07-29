from app.db import Database
from app.ontology import OntologyManager
from app.seed import Seeder

print("Connecting to Neo4j...")

db = Database()

try:
    print(f"✓ {db.test_connection()}")

    ontology = OntologyManager(db)
    ontology.create_constraints()

    seeder = Seeder(db)
    seeder.seed()

finally:
    db.close()
    