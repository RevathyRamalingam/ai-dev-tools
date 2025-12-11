# Concurrent Development Setup

This directory contains a full-stack online coding interview platform that can run both backend and frontend services simultaneously.

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
npm run install:all
npm run dev
```

This single command:
1. Installs all dependencies (root, backend, frontend)
2. Starts both backend and frontend services

### Option 2: Windows Users - Click to Start

Double-click `start.bat` to automatically install and run everything.

### Option 3: Mac/Linux Users - Shell Script

Run the startup script:
```bash
chmod +x start.sh
./start.sh
```

### Option 4: Manual Setup

```bash
# Install root dependencies (including concurrently)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Start both services
npm run dev
```

## Services URLs

After running `npm run dev`, you'll see:

```
[backend] Server running on http://localhost:5000
[frontend] VITE v5.0.0 ready in XXX ms
[frontend] Local: http://localhost:5173
```

Open your browser to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Available Commands

```bash
npm run install:all      # Install all dependencies
npm run dev              # Start both services (recommended)
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend
npm run build            # Build both services for production
npm run test             # Run all backend tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report
npm start                # Start backend server (production)
```

## Running Services Separately

### Terminal 1: Backend Only

```bash
npm run dev:backend
```

### Terminal 2: Frontend Only (in another terminal)

```bash
npm run dev:frontend
```

## Backend Details

Backend runs on **http://localhost:5000**

### Backend Commands

```bash
cd backend
npm run dev              # Development with auto-reload
npm start                # Production server
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Frontend Details

Frontend runs on **http://localhost:5173** with hot module replacement (HMR)

### Frontend Commands

```bash
cd frontend
npm run dev              # Development with HMR
npm run build            # Production build
npm run preview          # Preview production build
```

## Environment Configuration

### Backend (.env)

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=sqlite:./data/database.sqlite
```

### Frontend (.env)

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## Project Structure

```
02-endtoend/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── websocket/
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── package.json
│   └── .env.example
│
├── frontend/             # React Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── package.json          # Root configuration with concurrently
├── start.bat             # Windows startup script
├── start.sh              # Mac/Linux startup script
├── GETTING_STARTED.md    # Detailed setup guide
└── README.md             # Full project documentation
```

## Key Features

- ✅ Run both services with one command
- ✅ Color-coded console output from each service
- ✅ Automatic dependency installation
- ✅ Works on Windows, Mac, and Linux
- ✅ Hot module replacement (HMR) on frontend
- ✅ Auto-reload on backend with nodemon
- ✅ Integrated testing environment
- ✅ Production build support

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or on Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installed

Clear and reinstall:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

### WebSocket Connection Issues

Ensure environment variables are correct:

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

### Port 5173 Already in Use

Vite will automatically use the next available port. Check the console output for the actual URL.

## Performance Tips

- Keep both services running in separate terminals for cleaner logs
- Use `npm run dev:backend` and `npm run dev:frontend` separately for debugging
- Use `npm run test:watch` for TDD workflow
- Use `npm run build` before deployment

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates:
- `backend/dist/` (if applicable)
- `frontend/dist/`

### Run Production Server

```bash
npm start
```

## Documentation

- See `GETTING_STARTED.md` for detailed setup instructions
- See `README.md` for complete feature documentation
- See `backend/README.md` for backend-specific details
- See `frontend/README.md` for frontend-specific details

## Support

For issues:
1. Check `GETTING_STARTED.md` troubleshooting section
2. Verify Node.js and npm versions: `node --version && npm --version`
3. Clear node_modules and reinstall: `npm run install:all`
4. Check that ports 5000 and 5173 are available

## License

MIT
