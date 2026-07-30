# Operation Falcon

An interactive Knowledge Graph application that models an Air Force operations environment using **Neo4j**, **FastAPI**, **React**, and a local **LLM (Ollama)**. The project demonstrates how graph databases, ontologies, and natural language interfaces can be combined to explore operational data.

Users can:

- Visualize the entire ontology as an interactive graph
- Inspect objects and their properties
- Browse ontology objects from a sidebar
- Ask questions in natural language
- Generate Cypher automatically using an LLM
- Highlight graph objects returned by AI queries

---

# Demo

Current interface consists of:

- Interactive knowledge graph
- Ontology object explorer
- Object inspector
- AI Analyst panel
- Automatic graph highlighting

---

# Architecture

```
                +----------------------+
                |      React UI        |
                |----------------------|
                | Graph View           |
                | Sidebar              |
                | Inspector            |
                | AI Analyst           |
                +----------+-----------+
                           |
                      REST API
                           |
                +----------v-----------+
                |      FastAPI         |
                |----------------------|
                | /graph               |
                | /chat                |
                +----------+-----------+
                           |
             +-------------+-------------+
             |                           |
      Neo4j Repository            Ollama LLM
             |                           |
     Knowledge Graph           Cypher Generation
                               Natural Answers
```

---

# Tech Stack

## Backend

- Python 3.14
- FastAPI
- Neo4j Python Driver
- Pydantic
- Requests

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Flow (@xyflow/react)
- Dagre

## Database

- Neo4j

## AI

- Ollama
- Qwen 2.5 (default)

---

# Project Structure

```
operation-falcon/
│
├── operation-falcon/
│   ├── app/
│   │   ├── api.py
│   │   ├── chat.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── ontology.py
│   │   ├── repository.py
│   │   └── seed.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── operation-falcon-ui/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Features

## Interactive Knowledge Graph

The graph is rendered using React Flow.

Each ontology object becomes a graph node.

Relationships become edges.

Layout is automatically generated using Dagre.

Features include:

- Dragging
- Zooming
- Panning
- Object selection
- AI highlighting

---

## Ontology Explorer

The left sidebar groups objects by ontology type.

Example

```
Aircraft
    JF-17 #12
    F-16 #03

Pilot
    Squadron Leader Hassan
    Wing Commander Ali

Mission
    Operation Falcon

Airbase
    PAF Base Mushaf
```

Selecting an object:

- opens it in the Inspector
- highlights it in the graph

---

## Inspector

Selecting any graph object displays all stored properties.

Example

```
Pilot

Name
Squadron Leader Hassan

Rank
Squadron Leader

Flying Hours
1850

Clearance
Secret
```

---

## AI Analyst

Natural language questions can be asked.

Example

```
Which aircraft are mission ready?
```

The pipeline is

```
Question

↓

LLM generates Cypher

↓

Neo4j executes query

↓

Results returned

↓

LLM generates answer

↓

Matching nodes highlighted
```

Example response

```
Question

Which aircraft are mission ready?

Answer

The JF-17 #12 is mission ready.

Cypher

MATCH (a:Aircraft {mission_ready:true})
RETURN a, a.name, a.model
```

---

# Ontology

Current ontology

```
Aircraft

Pilot

Mission

Airbase

Radar

Squadron
```

Relationships

```
(Pilot)-[:FLIES]->(Aircraft)

(Aircraft)-[:ASSIGNED_TO]->(Mission)

(Aircraft)-[:STATIONED_AT]->(Airbase)

(Pilot)-[:MEMBER_OF]->(Squadron)

(Squadron)-[:BASED_AT]->(Airbase)

(Radar)-[:PROTECTS]->(Airbase)
```

---

# Backend

## api.py

REST API.

Endpoints

```
GET /graph

POST /chat
```

---

## repository.py

Responsible for all Neo4j interactions.

Responsibilities

- execute Cypher
- retrieve graph
- collect highlighted node IDs
- database abstraction layer

---

## chat.py

Responsible for the AI pipeline.

Flow

```
Question

↓

Prompt

↓

Ollama

↓

Cypher

↓

Neo4j

↓

Database Results

↓

LLM

↓

Final Answer
```

---

## ontology.py

Contains ontology definitions and graph schema information used by the LLM.

---

## seed.py

Creates demo Air Force data.

---

## db.py

Initializes the Neo4j driver.

---

# Frontend

## GraphView

Responsible for

- rendering graph
- Dagre layout
- node selection
- AI highlighting
- loading graph data

---

## Sidebar

Ontology explorer.

Groups objects by label.

Supports

- expanding/collapsing categories
- selecting objects

---

## DetailsPanel

Displays

- object type
- object properties

---

## ChatPanel

Provides

- question input
- AI response
- generated Cypher

---

## GraphContext

Global shared state.

Stores

```
selected object

highlighted nodes

graph objects
```

This allows every component to remain synchronized.

---

# REST API

## GET /graph

Returns graph relationships.

Example

```json
[
    {
        "source_id":"...",
        "source_label":"Aircraft",
        "relationship":"ASSIGNED_TO",
        "target_label":"Mission"
    }
]
```

---

## POST /chat

Input

```json
{
    "question":"Which aircraft are mission ready?"
}
```

Response

```json
{
    "answer":"JF-17 #12 is mission ready.",
    "cypher":"MATCH ...",
    "highlighted_nodes":[
        "...",
        "..."
    ]
}
```

---

# Running the Project

## Backend

Create virtual environment

```bash
python -m venv venv
```

Activate

Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
python main.py
```

---

## Frontend

Install

```bash
npm install
```

Run

```bash
npm run dev
```

---

## Neo4j

Start Neo4j Desktop.

Create the Operation Falcon database.

Run

```python
python app/seed.py
```

to populate the graph.

---

## Ollama

Start Ollama

```bash
ollama serve
```

Download a model

```bash
ollama pull qwen2.5:7b
```

---

# Example Questions

```
Which aircraft are mission ready?

Which pilot flies the JF-17?

Where is Squadron Leader Hassan stationed?

Which squadron is based at PAF Base Mushaf?

Show all aircraft.

Which mission has High priority?

Which aircraft are assigned to Operation Falcon?

Which radar protects the airbase?
```

---

# Future Improvements

- Automatic graph centering when selecting objects
- Rich node icons
- Custom React Flow node components
- Edge labels on hover
- Graph search
- Cypher history
- Multi-turn AI conversations
- Streaming LLM responses
- Authentication
- Role-based permissions
- SHACL validation
- RDF/OWL ontology export
- Graph analytics
- Timeline visualization
- Mission planning dashboard

---

# Learning Objectives

This project demonstrates practical usage of

- Knowledge Graphs
- Graph Databases
- Neo4j
- Cypher
- Ontology Design
- FastAPI
- React
- TypeScript
- Context API
- Graph Visualization
- LLM Function Calling
- Retrieval over Structured Data
- Human-in-the-loop AI Interfaces

---

# Acknowledgements

Built as a learning project to explore modern Knowledge Graph systems by combining graph databases, ontologies, interactive visualization, and local Large Language Models into a single end-to-end application.
