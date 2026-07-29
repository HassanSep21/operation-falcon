from app.db import Database


class OntologyManager:
    def __init__(self, db: Database):
        self.db = db

    def create_constraints(self):
        queries = [
            """
            CREATE CONSTRAINT aircraft_name IF NOT EXISTS
            FOR (a:Aircraft)
            REQUIRE a.name IS UNIQUE
            """,
            """
            CREATE CONSTRAINT pilot_name IF NOT EXISTS
            FOR (p:Pilot)
            REQUIRE p.name IS UNIQUE
            """,
            """
            CREATE CONSTRAINT mission_name IF NOT EXISTS
            FOR (m:Mission)
            REQUIRE m.name IS UNIQUE
            """,
            """
            CREATE CONSTRAINT airbase_name IF NOT EXISTS
            FOR (b:Airbase)
            REQUIRE b.name IS UNIQUE
            """,
            """
            CREATE CONSTRAINT squadron_name IF NOT EXISTS
            FOR (s:Squadron)
            REQUIRE s.name IS UNIQUE
            """,
            """
            CREATE CONSTRAINT radar_name IF NOT EXISTS
            FOR (r:Radar)
            REQUIRE r.name IS UNIQUE
            """
        ]

        with self.db.driver.session() as session:
            for query in queries:
                session.run(query)

        print("✓ Ontology created")