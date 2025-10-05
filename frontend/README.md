RSI Processor and Real-Time Dashboard

This project is a full-stack application that simulates live RSI and trade data generation using a Rust backend and visualizes it with a Next.js (React + TypeScript) frontend.
It uses Docker to run both the backend and the Redpanda Kafka broker, providing a production-grade setup.

Table of Contents

Overview

Tech Stack

Folder Structure

Setup Instructions

Running the Project

Testing the Endpoints

Frontend Integration

Common Issues and Fixes

Future Improvements

1. Overview

The project consists of three main components:

Backend (Rust): Generates random RSI and trade data, exposes REST API endpoints (/rsi and /trades).

Frontend (Next.js): Fetches and displays the RSI and trade data in real time using charts.

Redpanda (Kafka): Serves as a placeholder message broker for future streaming integration.

All services are containerized and managed with Docker Compose.

2. Tech Stack
Backend

Language: Rust

Framework: Actix Web

Libraries:

tokio (async runtime)

serde and serde_json (data serialization)

chrono (timestamps)

rand (random data generation)

API Endpoints:

GET /rsi → returns recent RSI data

GET /trades → returns recent trade data

Frontend

Framework: Next.js (React + TypeScript)

Visualization: Recharts

Styling: Tailwind CSS

Features:

Real-time updates (auto-refresh every 5 seconds)

Interactive line charts

Expandable JSON view for raw data

Infrastructure

Containerization: Docker, Docker Compose

Broker: Redpanda (Kafka-compatible)

3. Folder Structure
project-root/
│
├── backend/
│   ├── Cargo.toml
│   ├── Cargo.lock
│   └── src/
│       └── main.rs
│
├── frontend/
│   ├── app/
│   │   └── page.tsx
│   ├── components/
│   │   └── ChartCard.tsx
│   ├── services/
│   │   └── api.ts
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
├── console-config.yml
└── README.md

4. Setup Instructions
Prerequisites

Docker and Docker Compose installed

Node.js (v18 or later)

Rust toolchain (if running backend locally without Docker)

Clone the Repository
git clone https://github.com/your-username/RSI-Dashboard.git
cd RSI-Dashboard

5. Running the Project
Step 1: Start Docker Services

Run the following from the project root:

docker compose up -d


This starts:

redpanda-broker

rsi-backend

To view logs for the backend:

docker logs -f rsi-backend


When running successfully, you should see repeated lines:

🦀 RSI Processor + API with Data Generation started...
📈 Generated new RSI + Trade data entry...

Step 2: Verify Backend API

In a separate terminal (outside Docker), run:

curl http://localhost:8000/rsi
curl http://localhost:8000/trades


You should receive JSON output containing RSI and trade data.

Step 3: Run Frontend

Move to the frontend directory:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Open your browser and visit:

http://localhost:3000


You should see the real-time RSI dashboard with charts and JSON data.

6. Testing the Endpoints

RSI Endpoint

GET http://localhost:8000/rsi


Response:

[
  {
    "token_address": "Token_1",
    "rsi": 67.23,
    "timestamp": "2025-10-05T12:39:39Z"
  }
]


Trades Endpoint

GET http://localhost:8000/trades


Response:

[
  {
    "token_address": "Token_3",
    "price_in_sol": 145.23,
    "timestamp": "2025-10-05T12:39:42Z"
  }
]

7. Frontend Integration

The frontend automatically calls these APIs using the following service file:

frontend/services/api.ts

const API_URL = "http://localhost:8000";

export async function fetchRSIData() {
  const response = await fetch(`${API_URL}/rsi`);
  return response.json();
}

export async function fetchTradesData() {
  const response = await fetch(`${API_URL}/trades`);
  return response.json();
}


The main dashboard (app/page.tsx) displays live charts and refreshes data every 5 seconds.

8. Common Issues and Fixes

Issue:
EADDRINUSE: address already in use :::3000
Fix:
Run netstat -ano | findstr :3000 and terminate the process using
taskkill /PID <pid> /F

Issue:
Could not find a production build in the '.next' directory
Fix:
Run npm run build before starting the production server.

Issue:
Docker error: could not find end character of double-quoted text
Fix:
Ensure your docker-compose command line is properly wrapped:

command: >
  bash -c "
    apt-get update &&
    apt-get install -y librdkafka-dev pkg-config cmake build-essential &&
    cargo build &&
    cargo run
  "

9. Future Improvements

Integrate Kafka producer and consumer logic for real-time data streaming

Add WebSocket support for instant frontend updates

Store RSI and trade data in a database (PostgreSQL or MongoDB)

Add token filters and trend analytics

Deploy full stack using Docker Compose or Kubernetes on cloud platforms

Author

Madhav Pothagouni
VIT University Graduate – CSE (Data Science)
Email: pothagounimadhav@gmail.com
Location: Hyderabad, Telangana