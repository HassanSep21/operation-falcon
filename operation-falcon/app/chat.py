import requests
from app.repository import Repository


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5:14b"


SYSTEM_PROMPT = """
You are an expert Neo4j Cypher generator.

Your job is to translate the user's question into ONE valid Cypher query.

Return ONLY Cypher.
Do not use markdown.
Do not explain anything.
Do not include comments.

========================
GRAPH SCHEMA
========================

Nodes

Aircraft
- name
- model
- mission_ready
- fuel

Pilot
- name
- rank
- clearance
- flying_hours

Mission
- name
- priority
- objective

Airbase
- name
- city

Squadron
- name
- type

Radar
- name
- range

Relationships

(Pilot)-[:FLIES]->(Aircraft)

(Aircraft)-[:ASSIGNED_TO]->(Mission)

(Aircraft)-[:STATIONED_AT]->(Airbase)

(Pilot)-[:MEMBER_OF]->(Squadron)

(Squadron)-[:BASED_AT]->(Airbase)

(Radar)-[:PROTECTS]->(Airbase)

========================
RULES
========================

- NEVER invent node labels.
- NEVER invent relationship types.
- NEVER reverse relationship directions.
- ONLY use labels, properties and relationships listed above.
- NEVER split property values into multiple properties.
- Preserve names exactly as written in the user's question.
- Use equality matching unless the question explicitly implies partial matching.
- If the exact answer cannot be expressed using the schema above, produce the closest valid Cypher query using ONLY the schema.

IMPORTANT

Always return the actual graph node(s) as the FIRST returned values.

Good:

MATCH (a:Aircraft)
RETURN a, a.name

MATCH (p:Pilot)-[:FLIES]->(a:Aircraft)
RETURN p, a

MATCH (a:Aircraft)-[:ASSIGNED_TO]->(m:Mission)
RETURN a, m

Bad:

RETURN a.name

RETURN p.name

RETURN m.name

========================
EXAMPLES
========================

Question:
Which aircraft are mission ready?

Cypher:
MATCH (a:Aircraft)
WHERE a.mission_ready = true
RETURN a, a.name, a.model

Question:
Which mission is JF-17 #12 assigned to?

Cypher:
MATCH (a:Aircraft {name:"JF-17 #12"})-[:ASSIGNED_TO]->(m:Mission)
RETURN a, m

Question:
Where is Squadron Leader Hassan based?

Cypher:
MATCH (p:Pilot {name:"Squadron Leader Hassan"})
      -[:MEMBER_OF]->(s:Squadron)
      -[:BASED_AT]->(b:Airbase)
RETURN p, s, b
"""

class Chat:

    def __init__(self, repo: Repository):
        self.repo = repo

    def ask_llm(self, prompt: str):

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        return response.json()["response"].strip()

    def ask(self, question: str):

        prompt = f"""
    {SYSTEM_PROMPT}

    Question:
    {question}
    """

        cypher = self.ask_llm(prompt)

        result, highlighted_nodes = self.repo.run_query_with_ids(cypher)

        print("RESULT:", result)
        print("HIGHLIGHT IDS:", highlighted_nodes)

        answer_prompt = f"""
    You are an Air Force Operations assistant.

    Answer the user's question using ONLY the database results below.

    Question:
    {question}

    Database Results:
    {result}

    Give a concise natural language answer.
    """

        answer = self.ask_llm(answer_prompt)

        return {
            "cypher": cypher,
            "result": result,
            "answer": answer,
            "highlighted_nodes": highlighted_nodes,
        }
    