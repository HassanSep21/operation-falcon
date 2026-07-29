from app.db import Database


class Repository:
    def __init__(self, db: Database):
        self.db = db

    def run_query(self, query: str, parameters: dict | None = None):
        with self.db.driver.session() as session:
            result = session.run(query, parameters or {})

            records = []
            for record in result:
                records.append(record.data())

            return records

    def get_aircraft(self):
        query = """
        MATCH (a:Aircraft)
        RETURN a
        ORDER BY a.name
        """
        return self.run_query(query)

    def get_pilots(self):
        query = """
        MATCH (p:Pilot)
        RETURN p
        """
        return self.run_query(query)

    def get_missions(self):
        query = """
        MATCH (m:Mission)
        RETURN m
        """
        return self.run_query(query)

    def get_airbases(self):
        query = """
        MATCH (b:Airbase)
        RETURN b
        """
        return self.run_query(query)

    def get_graph(self):
        query = """
        MATCH (n)-[r]->(m)
        RETURN
            elementId(n) AS source_id,
            labels(n)[0] AS source_label,
            properties(n) AS source_props,

            type(r) AS relationship,

            elementId(m) AS target_id,
            labels(m)[0] AS target_label,
            properties(m) AS target_props
        """

        return self.run_query(query)

    def get_pilot_missions(self):
        query = """
        MATCH (p:Pilot)-[:FLIES]->(a:Aircraft)-[:ASSIGNED_TO]->(m:Mission)
        RETURN p.name AS pilot,
               a.name AS aircraft,
               m.name AS mission
        """
        return self.run_query(query)
    