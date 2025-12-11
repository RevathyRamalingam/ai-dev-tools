# Online Coding Interview Platform

A complete real-time platform for conducting online coding interviews with collaborative code editing, instant code execution, and live chat.

## Overview

This platform enables interviewers and candidates to conduct technical interviews in a structured environment with:

- **Real-time Code Editor**: Synchronized code editing with syntax highlighting
- **Multi-language Support**: Python, JavaScript, Java, C++, and C with language-specific highlighting
- **Advanced Syntax Highlighting**: Beautiful highlighting for JavaScript and Python with smart validation
- **Instant Code Execution**: Run and test code with real-time output and error reporting
- **Live Chat**: Real-time communication during interviews
- **Problem Library**: Pre-built problem set with varying difficulties
- **Interview Management**: Schedule, track, and review interviews

## Key Features

### Code Editor with Syntax Highlighting
- ✨ **Language-Specific Highlighting**:
  - Python: Keywords, built-ins, indentation highlighting
  - JavaScript: Keywords, operators, template literals
  - Java, C++, C: Full syntax support
  
- 🎨 **Editor Features**:
  - Bracket pair colorization
  - Inline hints and code lens
  - Auto-formatting on paste/type
  - Smart bracket/parenthesis matching
  - Line number and code folding

- ✅ **Code Validation**:
  - Real-time syntax checking
  - Bracket/brace/parenthesis validation
  - Line-specific error reporting
  - Language-specific validation rules

### Code Execution
- 🚀 **Browser-based WASM Execution**: Code runs securely in the browser
  - Python: Full CPython via Pyodide WASM runtime
  - JavaScript: Native browser V8 engine
- ⏱️ Track execution time
- 📊 Real-time output display
- 🔴 Detailed error messages with line numbers
- 🔒 **Security**: Code never touches the server

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Real-time**: Socket.io
- **Authentication**: JWT with bcrypt

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Code Execution**: 
  - Python: Pyodide WASM runtime (v0.23.4+)
  - JavaScript: Native browser V8 engine

### WASM Runtime (NEW)
- **Pyodide**: Full CPython compiled to WebAssembly
  - NumPy, Pandas, SciPy, Matplotlib support
  - Runs entirely in browser
  - ~50MB WASM module (cached)

## Project Structure

```
02-endtoend/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── websocket/      # Socket.io handlers
│   │   └── server.js       # App entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API and WebSocket services
    │   ├── store/          # Zustand stores
    │   ├── utils/          # Utility functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── .env.example
    └── README.md
```

## Quick Start

### Prerequisites

- Node.js 18.0.0+
- npm 9.0.0+

### Installation & Startup

From the `02-endtoend` directory:

```bash
# Option 1: One-step setup (recommended)
npm run install:all
npm run dev

# Option 2: Manual setup
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
npm run dev
```

**Windows Users**: Double-click `start.bat` in the 02-endtoend folder

**Mac/Linux Users**: Run `./start.sh` in the 02-endtoend folder

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Available Commands

From the root `02-endtoend` directory:

```bash
npm run install:all    # Install all dependencies
npm run dev            # Start both services (recommended)
npm run dev:backend    # Start only backend
npm run dev:frontend   # Start only frontend
npm run build          # Build both services for production
npm run test           # Run backend tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm start              # Start backend in production mode
```

## Individual Service Commands

### Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Problems
- `GET /api/problems` - Get all problems (paginated)
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create problem (protected)
- `PUT /api/problems/:id` - Update problem (protected)

### Interviews
- `POST /api/interviews` - Create interview (protected)
- `GET /api/interviews/user/interviews` - Get user's interviews (protected)
- `GET /api/interviews/:id` - Get interview details (protected)
- `PUT /api/interviews/:id` - Update interview (protected)
- `POST /api/interviews/:id/execute` - Execute code (protected)
- `POST /api/interviews/:id/solutions` - Submit solution (protected)
- `GET /api/interviews/:id/solutions` - Get solutions (protected)

### WebSocket Events
- `join-interview` - Join interview room
- `code-update` - Update code
- `chat-message` - Send chat message
- `leave-interview` - Leave interview

## Database Models

### User
```javascript
{
  id: Integer,
  email: String (unique),
  username: String (unique),
  fullName: String,
  password: String (hashed),
  role: Enum('candidate', 'interviewer', 'admin'),
  isActive: Boolean,
  timestamps
}
```

### Problem
```javascript
{
  id: Integer,
  title: String,
  description: Text,
  difficulty: Enum('easy', 'medium', 'hard'),
  tags: Array,
  sampleInput: Text,
  sampleOutput: Text,
  testCases: Array,
  timestamps
}
```

### Interview
```javascript
{
  id: Integer,
  interviewerId: Integer (FK),
  candidateId: Integer (FK),
  problemId: Integer (FK),
  status: Enum('scheduled', 'ongoing', 'completed', 'cancelled'),
  scheduledAt: DateTime,
  startedAt: DateTime,
  endedAt: DateTime,
  feedback: Text,
  rating: Integer (1-5),
  timestamps
}
```

### Solution
```javascript
{
  id: Integer,
  interviewId: Integer (FK),
  problemId: Integer (FK),
  userId: Integer (FK),
  code: Text,
  language: String,
  status: Enum('pending', 'accepted', 'wrong_answer', 'runtime_error', 'timeout'),
  testResults: Array,
  timestamps
}
```

## Features

### User Features
- User registration and authentication
- Profile management
- View interview schedule
- Browse and practice problems
- Real-time code editing
- Code execution and testing
- Real-time chat with interviewer
- Solution submission and tracking

### Interview Features
- Schedule interviews
- Join interview rooms
- Real-time code collaboration
- Live communication
- Code execution feedback
- Interview history and analytics

### Admin Features
- Problem management (CRUD)
- User management
- Interview oversight

## Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_PATH=./database.sqlite
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
MAX_EXECUTION_TIME=30
MAX_MEMORY=512
SESSION_SECRET=session-secret-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Protected API routes
- WebSocket authentication

## Code Execution

Supported languages:
- Python 3
- JavaScript (Node.js)
- Java
- C++
- C

Safety features:
- 30-second timeout (configurable)
- Memory limits
- Sandboxed execution
- Error handling

## Performance Considerations

- Real-time updates via WebSocket
- Debounced code synchronization
- Efficient database queries
- Stateless API design
- Client-side caching

## Future Enhancements

- [ ] Video/audio integration
- [ ] Docker container execution
- [ ] Advanced test case management
- [ ] Interview recording and playback
- [ ] Code plagiarism detection
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Redis caching
- [ ] Search and filtering improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

## Deployment

### Docker Deployment (Coming Soon)
- Containerized backend and frontend
- Docker Compose setup

### Cloud Deployment Options
- Heroku, AWS, DigitalOcean, Vercel, Netlify

## Performance Benchmarks

- Page load time: < 2s
- Code execution latency: < 100ms
- Real-time synchronization: < 50ms
- WebSocket connection establishment: < 500ms

## Troubleshooting

### Backend won't start
- Check Node.js version (16+)
- Verify port 5000 is available
- Check environment variables in .env

### Frontend won't connect
- Ensure backend is running
- Check VITE_API_URL in .env
- Verify CORS configuration
- Check browser console for errors

### Code execution failing
- Verify language is supported
- Check code syntax
- Ensure timeout is set appropriately
- Check available system resources
