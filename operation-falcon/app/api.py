from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import Database
from app.repository import Repository
from pydantic import BaseModel
from app.chat import Chat

app = FastAPI(title="Operation Falcon API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()
repo = Repository(db)
chat = Chat(repo)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "Operation Falcon API is running"}


@app.get("/aircraft")
def aircraft():
    return repo.get_aircraft()


@app.get("/pilots")
def pilots():
    return repo.get_pilots()


@app.get("/missions")
def missions():
    return repo.get_missions()


@app.get("/airbases")
def airbases():
    return repo.get_airbases()


@app.get("/graph")
def graph():
    return repo.get_graph()


@app.get("/pilot-missions")
def pilot_missions():
    return repo.get_pilot_missions()


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    answer = chat.ask(request.question)
    return {
        "question": request.question,
        "answer": answer
    }
