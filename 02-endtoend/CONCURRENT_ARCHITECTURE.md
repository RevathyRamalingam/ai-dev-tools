# Concurrent Development Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│              npm run dev (from 02-endtoend/)                │
│                                                             │
│  Uses: concurrently package to run both services          │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
    ┌──────▼──────┐              ┌────────▼────────┐
    │   Backend   │              │    Frontend     │
    │  (Express)  │              │    (React/Vite)│
    └──────┬──────┘              └────────┬────────┘
           │                               │
    ┌──────▼──────────────┐       ┌───────▼────────────┐
    │ npm run dev         │       │ npm run dev        │
    │ (nodemon)           │       │ (Vite dev server)  │
    │                     │       │                    │
    │ Port: 5000          │       │ Port: 5173         │
    │ Auto-reload: Yes    │       │ HMR: Yes           │
    │ DB: SQLite          │       │ Build: Vite        │
    └─────────────────────┘       └────────────────────┘
```

## Installation Flow

```
npm run install:all
       │
       ├─► npm install (root)
       │   └─► concurrently package installed
       │
       ├─► cd backend && npm install && cd ..
       │   └─► Express, Sequelize, Socket.io, etc.
       │
       └─► cd frontend && npm install && cd ..
           └─► React, Vite, Monaco Editor, etc.
```

## Execution Flow

```
npm run dev
    │
    └─► concurrently "npm:dev:backend" "npm:dev:frontend"
        │
        ├─► npm:dev:backend (cd backend && npm run dev)
        │   │
        │   └─► nodemon src/server.js
        │       │
        │       ├─► Express app starts
        │       ├─► SQLite database connects
        │       ├─► Socket.io server ready
        │       └─► Listening on http://localhost:5000
        │
        └─► npm:dev:frontend (cd frontend && npm run dev)
            │
            └─► vite
                │
                ├─► Dev server starts
                ├─► HMR enabled
                ├─► Compiled on file change
                └─► Ready at http://localhost:5173
```

## Cross-Platform Startup

```
User Action
    │
    ├─► Windows: Double-click start.bat
    │   │
    │   └─► start.bat
    │       ├─► Echoes "Starting..."
    │       ├─► Calls npm run install:all
    │       ├─► Calls npm run dev
    │       └─► Services start
    │
    ├─► Mac/Linux: Run start.sh
    │   │
    │   └─► ./start.sh
    │       ├─► Echoes "Starting..."
    │       ├─► Calls npm run install:all
    │       ├─► Calls npm run dev
    │       └─► Services start
    │
    └─► Manual: npm run dev
        │
        └─► Calls concurrently directly
            └─► Services start
```

## Project Structure

```
02-endtoend/
│
├── package.json ◄── Root level
│   └── scripts:
│       ├── install:all
│       ├── dev
│       ├── dev:backend
│       ├── dev:frontend
│       ├── build
│       ├── test
│       └── start
│
├── backend/
│   ├── package.json ◄── Backend specific
│   │   └── scripts:
│   │       ├── dev (nodemon)
│   │       ├── start
│   │       ├── test
│   │       └── test:coverage
│   │
│   ├── src/
│   │   ├── server.js ◄── Entry point
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── websocket/
│   │
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   │
│   └── .env.example
│
├── frontend/
│   ├── package.json ◄── Frontend specific
│   │   └── scripts:
│   │       ├── dev (vite)
│   │       ├── build
│   │       └── preview
│   │
│   ├── src/
│   │   ├── main.jsx ◄── Entry point
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example
│
├── start.bat ◄── Windows users
├── start.sh ◄── Mac/Linux users
│
├── CONCURRENT_SETUP.md ◄── Setup guide
├── GETTING_STARTED.md ◄── Quick start
├── CONCURRENT_SETUP_SUMMARY.md ◄── This file
└── README.md ◄── Full documentation
```

## Service Communication

```
┌──────────────────────────────────────────┐
│        Frontend (React/Vite)              │
│        http://localhost:5173              │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Components                          │ │
│  │ - CodeEditor                        │ │
│  │ - ChatPanel                         │ │
│  │ - OutputPanel                       │ │
│  └──────┬──────────────┬───────────────┘ │
│         │              │                  │
│         │ HTTP API     │ WebSocket        │
│         │ (axios)      │ (Socket.io)      │
└─────────┼──────────────┼──────────────────┘
          │              │
          ▼              ▼
┌──────────────────────────────────────────┐
│        Backend (Express)                  │
│        http://localhost:5000              │
│                                           │
│  ┌────────────┬─────────────────────────┐│
│  │ REST API   │ WebSocket Handler        ││
│  │ Routes     │ - Code sync              ││
│  │ - auth     │ - Chat messages          ││
│  │ - problems │ - Cursor tracking        ││
│  │ - interview│ - Execution results      ││
│  │ - solutions│                         ││
│  └────────────┴──────────┬───────────────┘│
│                          │                 │
└──────────────────────────┼─────────────────┘
                           │
                    ┌──────▼──────┐
                    │  SQLite DB  │
                    │  database.  │
                    │  sqlite     │
                    └─────────────┘
```

## Command Execution Timeline

```
Time  │ Action
──────┼──────────────────────────────────────────────
0s    │ User runs: npm run dev
      │
1s    │ [1] concurrently checks npm scripts
      │ [2] Starts npm:dev:backend process
      │ [3] Starts npm:dev:frontend process
      │
2-3s  │ [backend] nodemon starts
      │ [backend] Connecting to SQLite...
      │
3-4s  │ [backend] Server running on :5000
      │ [backend] Database connected
      │ [backend] Ready for requests
      │
2-4s  │ [frontend] Vite server starting
      │ [frontend] Dev server ready
      │
4-5s  │ [frontend] VITE v5.0.0 ready in XXX ms
      │ [frontend] Local: http://localhost:5173
      │
5s    │ ✓ Both services running
      │ ✓ User can access http://localhost:5173
      │ ✓ Frontend connects to http://localhost:5000
```

## Development Workflow

```
Developer
    │
    ├─► Modify backend code
    │   │
    │   └─► nodemon detects change
    │       │
    │       └─► Auto-restart server
    │           └─► Database connection maintained
    │               └─► Hot reload ready
    │
    ├─► Modify frontend code
    │   │
    │   └─► Vite detects change
    │       │
    │       └─► HMR updates module
    │           │
    │           └─► Browser refreshes
    │               └─► State preserved
    │
    └─► Run tests
        │
        └─► npm test
            │
            └─► Jest runs integration tests
                │
                └─► Coverage report generated
```

## Production Build Flow

```
npm run build
    │
    ├─► npm run build:backend
    │   │
    │   └─► Optimizes backend (if applicable)
    │       └─► dist/ created
    │
    └─► npm run build:frontend
        │
        └─► vite build
            │
            ├─► Code splitting
            ├─► Minification
            ├─► Asset optimization
            │
            └─► frontend/dist/ created (ready for deployment)
```

## Key Points

🔹 **Concurrently**: Runs multiple npm scripts with color-coded output
🔹 **Nodemon**: Auto-reloads backend on file changes
🔹 **Vite HMR**: Hot module replacement for instant frontend updates
🔹 **Single Terminal**: Both services visible in one terminal
🔹 **Easy Debugging**: Color-coded logs from each service
🔹 **Fast Development**: No manual server restart needed
🔹 **Production Ready**: Build scripts for deployment

## Summary

This concurrent setup enables developers to work on both backend and frontend simultaneously with instant feedback, all from a single terminal window with clear, color-coded output from each service.
