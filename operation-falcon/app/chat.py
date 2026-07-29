import requests
from app.repository import Repository


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5:14b"


SYSTEM_PROMPT = """
You are an expert Neo4j Cypher generator.

Return ONLY a Cypher query.

Database schema:

(:Pilot)-[:FLIES]->(:Aircraft)
(:Aircraft)-[:ASSIGNED_TO]->(:Mission)
(:Aircraft)-[:STATIONED_AT]->(:Airbase)
(:Pilot)-[:MEMBER_OF]->(:Squadron)
(:Squadron)-[:BASED_AT]->(:Airbase)
(:Radar)-[:PROTECTS]->(:Airbase)

Node properties:

Pilot:
name
rank
flying_hours
clearance

Aircraft:
name
model
fuel
mission_ready

Mission:
name
priority
objective

Airbase:
name
city

Radar:
name
range

Squadron:
name
type

Return ONLY valid Cypher.
No markdown.
No explanation.
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

        result = self.repo.run_query(cypher)

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
            "answer": answer
        }
    