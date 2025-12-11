# Getting Started

## Prerequisites

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)

## Quick Installation & Startup

### Option 1: One-Step Setup (Recommended)

From the `02-endtoend` directory:

```bash
npm run install:all
npm run dev
```

This installs all dependencies and starts both backend and frontend automatically.

### Option 2: Manual Setup

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..

# Start both services
npm run dev
```

## Services

After running `npm run dev`, you'll have:

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173

## Running Services Separately

```bash
# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend
```

## Backend Development

```bash
cd backend

npm run dev          # Development with auto-reload
npm start            # Production mode
npm test             # Run all tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
```

## Frontend Development

```bash
cd frontend

npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview build
```

## Environment Files

### Backend (.env)

```bash
cd backend && cp .env.example .env
```

Configure:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=sqlite:./data/database.sqlite
```

### Frontend (.env)

```bash
cd frontend && cp .env.example .env
```

Configure:
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile

### Problems
- `GET /api/problems` - List (with filters)
- `POST /api/problems` - Create
- `GET /api/problems/:id` - Get details
- `PUT /api/problems/:id` - Update
- `DELETE /api/problems/:id` - Delete

### Interviews
- `GET /api/interviews` - List
- `POST /api/interviews` - Create
- `GET /api/interviews/:id` - Get details
- `PUT /api/interviews/:id` - Update
- `GET /api/interviews/:id/solutions` - Get solutions
- `POST /api/interviews/:id/solutions` - Submit solution
- `POST /api/interviews/:id/execute` - Execute code

## WebSocket Events

**Client → Server:**
- `code-update` - Real-time code sync
- `chat-message` - Send message
- `cursor-move` - Cursor position

**Server → Client:**
- `code-updated` - Code updated
- `chat-message` - Receive message
- `code-executed` - Code execution result

## Testing

```bash
# Run all tests
npm test

# Run specific test file
cd backend && npm test -- tests/integration/auth.test.js

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

### Dependency Issues
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm run install:all
```

### Database Reset
```bash
cd backend
rm data/database.sqlite
npm run dev
```

## Project Structure

```
02-endtoend/
├── backend/
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## Next Steps

1. Create an account
2. Explore problems
3. Create interview sessions
4. Start coding and collaborating
  "tags": ["array", "hash-table"],
  "sampleInput": "[2,7,11,15]\ntarget = 9",
  "sampleOutput": "[0,1]",
  "testCases": [
    {
      "input": "[2,7,11,15]\ntarget = 9",
      "output": "[0,1]",
      "hidden": false
    }
  ]
}
```

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change port in .env
PORT=5001
```

**Database errors:**
```bash
# Delete existing database
rm database.sqlite

# Restart server (will recreate database)
npm run dev
```

**Dependencies not installed:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Vite will suggest another port automatically
```

**Cannot connect to backend:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env matches backend URL
- Check browser console for CORS errors

**Code editor not loading:**
- Clear browser cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require login)
- `/dashboard` - Your interview dashboard
- `/problems` - Browse problems
- `/interview/:interviewId` - Interview session

## Testing Code Execution

Test the code execution feature:

### Python
```python
# Simple print
print("Hello, World!")

# With input
n = int(input())
print(n * 2)
```

### JavaScript
```javascript
console.log("Hello, World!");
console.log(2 + 2);
```

### Java
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### C++
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

### C
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

## Development Features

### Hot Reload
- Frontend: Changes auto-refresh browser
- Backend: Use `npm run dev` for nodemon watch mode

### Database
- SQLite database at `/backend/database.sqlite`
- Auto-creates tables on first run
- View with: `sqlite3 database.sqlite`

### API Documentation
- Backend runs Swagger (coming soon)
- Check requests in browser Network tab
- All endpoints documented in `README.md`

## Performance Tips

### Optimize Code Execution
- Keep execution timeout at 30 seconds for production
- Limit memory to prevent resource exhaustion

### Improve Real-time Performance
- Monitor WebSocket connection in DevTools
- Check latency in Network tab

### Frontend Performance
- Use browser DevTools Performance tab
- Check Network tab for slow requests

## File Structure Quick Reference

```
backend/src/
├── config/           # Configuration and setup
├── models/          # Database models (Sequelize)
├── controllers/     # Request handlers
├── services/        # Business logic and code execution
├── routes/          # API endpoints
├── middleware/      # Authentication and error handling
├── websocket/       # Real-time collaboration
└── server.js        # Entry point

frontend/src/
├── components/      # Reusable UI components
├── pages/          # Full page components
├── services/       # API and WebSocket clients
├── store/          # Global state (Zustand)
├── utils/          # Helper functions
├── App.jsx         # Main app wrapper
└── main.jsx        # Entry point
```

## Environment Variables Reference

### Backend (.env)
```env
PORT                    # Server port (default: 5000)
NODE_ENV               # Environment (development/production)
DB_PATH                # SQLite database path
JWT_SECRET             # Secret for JWT signing
JWT_EXPIRE             # Token expiration time
CORS_ORIGIN            # Allowed origins
MAX_EXECUTION_TIME     # Code timeout in seconds
MAX_MEMORY             # Max memory for execution
SESSION_SECRET         # Session encryption secret
```

### Frontend (.env)
```env
VITE_API_URL          # Backend API URL
VITE_SOCKET_URL       # WebSocket server URL
```

## Next Steps

1. **Customize**: Modify styles in `tailwind.config.js`
2. **Add Problems**: Create coding problems via API
3. **Deploy**: Use provided Docker Compose or deploy to cloud
4. **Extend**: Add more languages, features, or integrations

## Support & Resources

- Check `backend/README.md` for API documentation
- Check `frontend/README.md` for component documentation
- Review code comments in source files
- Check browser console for error messages

## Production Deployment Checklist

- [ ] Change JWT_SECRET in backend .env
- [ ] Set NODE_ENV=production
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Enable database backups
- [ ] Test all features in staging environment
- [ ] Set up CI/CD pipeline

Happy coding! 🚀
