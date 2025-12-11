# Coding Interview Platform - Backend

Express.js backend for the online coding interview platform.

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Problem Management**: Create, retrieve, and manage coding problems
- **Interview Sessions**: Schedule and manage interview sessions
- **Code Execution**: Execute code in multiple languages with sandboxing
- **Real-time Collaboration**: WebSocket support for real-time code sharing and chat
- **Solution Tracking**: Track and evaluate code solutions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Code Execution**: Child process with timeout management

## Supported Languages

- Python
- JavaScript/Node.js
- Java
- C++
- C

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

2. Update `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)

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
- `GET /api/interviews/:id/solutions` - Get interview solutions (protected)

## WebSocket Events

### Client to Server
- `join-interview` - Join an interview room
- `code-update` - Update code in shared editor
- `chat-message` - Send chat message
- `test-result` - Send test execution result
- `cursor-move` - Update cursor position
- `leave-interview` - Leave interview room

### Server to Client
- `user-joined` - New user joined interview
- `code-updated` - Code updated by peer
- `new-chat-message` - New chat message
- `test-result-update` - Test execution result
- `cursor-updated` - Cursor position updated
- `user-left` - User left interview

## Database Schema

### User
- id, email, username, fullName, password, role, isActive, timestamps

### Problem
- id, title, description, difficulty, tags, sampleInput, sampleOutput, testCases, timestamps

### Interview
- id, interviewerId, candidateId, problemId, status, scheduledAt, startedAt, endedAt, feedback, rating, timestamps

### Solution
- id, interviewId, problemId, userId, code, language, status, testResults, timestamps

### Message
- id, interviewId, senderId, content, messageType, timestamps

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Testing

```bash
npm test
```

## Development Notes

- JWT tokens expire after 7 days (configurable)
- Code execution timeout: 30 seconds (configurable)
- SQLite database is stored in `database.sqlite`
- WebSocket rooms are named `interview-{interviewId}`

## Future Enhancements

- [ ] Redis caching for performance
- [ ] Code execution in Docker containers
- [ ] Advanced test case management
- [ ] Interview recording/playback
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation with Swagger
