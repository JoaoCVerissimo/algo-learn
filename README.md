# AlgoLearn - Interactive Algorithm Learning Platform

An interactive platform for learning algorithms through step-by-step visualizations and hands-on coding challenges. Everything runs locally with no paid dependencies.

## Architecture

```
Browser  ──HTTP──▶  API Server  ──Docker SDK──▶  Runner Container (ephemeral)
                       │
                    SQLite DB
```

| Service | Technology | Purpose |
|---------|-----------|---------|
| **frontend** | React 19, Vite, D3.js, Monaco Editor, Zustand, Tailwind CSS | UI, visualizations, code editor |
| **api** | Node.js, Fastify, Drizzle ORM, SQLite | REST API, problem management, code execution |
| **runner** | Docker (Node.js Alpine) | Sandboxed user code execution |
| **shared** | TypeScript | Shared type definitions |

### Algorithm Visualization Engine

Visualizations use **generator functions** that yield complete state snapshots at each step. A playback hook collects steps into an array and controls which snapshot D3.js renders. This enables instant forward/backward/jump operations.

```
Generator Function → [Step₁, Step₂, ..., Stepₙ] → Playback Hook → D3.js Renderer
```

### Code Execution Sandbox

User code runs in ephemeral Docker containers with strict security:
- No network access (`NetworkMode: "none"`)
- Read-only filesystem + 16MB tmpfs
- 128MB RAM, 0.5 CPU, 64 PIDs max
- 10-second hard timeout
- Non-root user, no-new-privileges

## Features

- **Sorting Visualizations**: Bubble Sort, Quick Sort, Merge Sort
- **Graph Traversal**: BFS, DFS with force-directed layout
- **Dynamic Programming**: Fibonacci, 0/1 Knapsack, LCS with table visualization
- **Pathfinding**: Dijkstra, A* on interactive grids
- **Code Editor**: Monaco Editor with TypeScript support
- **Practice Problems**: 9 problems with test case execution
- **Progress Tracking**: Track solved/attempted problems

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for code execution sandbox)

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the runner Docker image
docker build -t algo-learn-runner:latest packages/runner

# Seed the database with problems
pnpm --filter api db:seed

# Start development servers
pnpm run dev
```

- Frontend: http://localhost:3000 (or http://localhost:5173 with Vite)
- API: http://localhost:3001

## Using Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:3001

## Project Structure

```
algo-learn/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   ├── frontend/        # React + Vite + D3.js + Monaco
│   │   └── src/
│   │       ├── algorithms/      # Generator-based algorithm implementations
│   │       ├── components/      # React components + D3 visualizers
│   │       ├── hooks/           # useVisualization playback hook
│   │       └── stores/          # Zustand state management
│   ├── api/             # Fastify + Drizzle + SQLite
│   │   └── src/
│   │       ├── routes/          # REST API endpoints
│   │       ├── services/        # Docker code runner
│   │       ├── db/              # Schema + migrations
│   │       └── seed/            # Problem seed data
│   └── runner/          # Docker sandbox (Node.js Alpine + test harness)
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Available Commands

| Command | Description |
|---------|-------------|
| `make install` | Install all dependencies |
| `make dev` | Start all dev servers |
| `make dev-frontend` | Start frontend only |
| `make dev-api` | Start API only |
| `make build-runner` | Build runner Docker image |
| `make seed` | Seed database with problems |
| `make test` | Run all tests |
| `make lint` | Run linter |
| `make typecheck` | Run TypeScript type checking |
| `make docker-up` | Start all services via Docker Compose |
| `make docker-down` | Stop Docker Compose services |
| `make clean` | Remove node_modules and build artifacts |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List categories |
| GET | `/api/problems` | List problems (filter: `?category=&difficulty=`) |
| GET | `/api/problems/:slug` | Problem detail with test cases |
| POST | `/api/submissions` | Submit code for execution |
| GET | `/api/submissions/:id` | Get submission result |
| GET | `/api/progress` | User progress |
| GET | `/api/health` | Health check |

## Tech Stack

- **Language**: TypeScript everywhere
- **Frontend**: React 19, Vite, D3.js, Monaco Editor, Zustand, Tailwind CSS, React Router
- **Backend**: Fastify, Drizzle ORM, better-sqlite3
- **Sandbox**: Docker, dockerode
- **Testing**: Vitest
- **CI**: GitHub Actions
- **Package Management**: pnpm workspaces
