from app.db import Database


class Seeder:
    def __init__(self, db: Database):
        self.db = db

    def seed(self):
        self.seed_aircraft()
        self.seed_pilot()
        self.seed_airbase()
        self.seed_mission()
        self.seed_radar()
        self.seed_squadron()

        self.create_relationships()

        print("✓ Seed data created")

    def seed_aircraft(self):
        query = """
        MERGE (a:Aircraft {name: $name})
        SET
            a.model = $model,
            a.fuel = $fuel,
            a.mission_ready = $mission_ready
        """

        aircraft = [
            {
                "name": "JF-17 #12",
                "model": "JF-17 Block III",
                "fuel": 92,
                "mission_ready": True,
            },
            {
                "name": "JF-17 #21",
                "model": "JF-17 Block III",
                "fuel": 74,
                "mission_ready": False,
            },
        ]

        for plane in aircraft:
            self.db.execute(query, plane)

        print("✓ Aircraft seeded")

    def seed_pilot(self):
        self.db.execute("""
        MERGE (p:Pilot {name: $name})
        SET
            p.rank = $rank,
            p.flying_hours = $hours,
            p.clearance = $clearance
        """, {
            "name": "Squadron Leader Hassan",
            "rank": "Squadron Leader",
            "hours": 1850,
            "clearance": "Secret"
        })

        print("✓ Pilot seeded")

    def seed_airbase(self):
        self.db.execute("""
        MERGE (b:Airbase {name: $name})
        SET b.city = $city
        """, {
            "name": "PAF Base Mushaf",
            "city": "Sargodha"
        })

        print("✓ Airbase seeded")

    def seed_mission(self):
        self.db.execute("""
        MERGE (m:Mission {name: $name})
        SET
            m.priority = $priority,
            m.objective = $objective
        """, {
            "name": "Operation Falcon",
            "priority": "High",
            "objective": "Intercept unidentified aircraft"
        })

        print("✓ Mission seeded")

    def seed_radar(self):
        self.db.execute("""
        MERGE (r:Radar {name: $name})
        SET r.range = $range
        """, {
            "name": "Radar Alpha",
            "range": "450 km"
        })

        print("✓ Radar seeded")

    def seed_squadron(self):
        self.db.execute("""
        MERGE (s:Squadron {name: $name})
        SET s.type = $type
        """, {
            "name": "No. 14 Squadron",
            "type": "Fighter"
        })

        print("✓ Squadron seeded")

    def create_relationships(self):
        queries = [
            """
            MATCH (p:Pilot {name:'Squadron Leader Hassan'})
            MATCH (a:Aircraft {name:'JF-17 #12'})
            MERGE (p)-[:FLIES]->(a)
            """,
            """
            MATCH (a:Aircraft {name:'JF-17 #12'})
            MATCH (b:Airbase {name:'PAF Base Mushaf'})
            MERGE (a)-[:STATIONED_AT]->(b)
            """,
            """
            MATCH (a:Aircraft {name:'JF-17 #12'})
            MATCH (m:Mission {name:'Operation Falcon'})
            MERGE (a)-[:ASSIGNED_TO]->(m)
            """,
            """
            MATCH (p:Pilot {name:'Squadron Leader Hassan'})
            MATCH (s:Squadron {name:'No. 14 Squadron'})
            MERGE (p)-[:MEMBER_OF]->(s)
            """,
            """
            MATCH (s:Squadron {name:'No. 14 Squadron'})
            MATCH (b:Airbase {name:'PAF Base Mushaf'})
            MERGE (s)-[:BASED_AT]->(b)
            """,
            """
            MATCH (r:Radar {name:'Radar Alpha'})
            MATCH (b:Airbase {name:'PAF Base Mushaf'})
            MERGE (r)-[:PROTECTS]->(b)
            """
        ]

        for query in queries:
            self.db.execute(query)

        print("✓ Relationships created")
