# Coding Interview Platform - Frontend

React-based frontend for the online coding interview platform.

## Features

- **User Authentication**: Register, login, and profile management
- **Problem Browsing**: View and filter coding problems by difficulty
- **Interview Interface**: Real-time collaborative code editor
- **Code Execution**: Run code and view output instantly
- **Chat System**: Real-time messaging during interviews
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **Code Editor**: Monaco Editor
- **Real-time**: Socket.io Client
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Installation

```bash
npm install
```

## Configuration

The frontend uses environment variables for API configuration. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── CodeEditor.jsx  # Monaco editor wrapper
│   ├── ChatPanel.jsx   # Chat interface
│   ├── OutputPanel.jsx # Code output display
│   ├── ProblemStatement.jsx # Problem details
│   └── Navigation.jsx   # Top navigation bar
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── ProblemsPage.jsx
│   └── InterviewPage.jsx
├── services/           # API and WebSocket services
│   ├── api.js          # REST API client
│   └── websocket.js    # Socket.io client
├── store/              # Zustand state management
│   └── index.js        # Global stores
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Key Pages

### Login & Register
- User authentication with JWT tokens
- Email validation
- Password confirmation

### Home Page
- Landing page with features overview
- Quick navigation for authenticated users

### Dashboard
- View all scheduled interviews
- See interview status (scheduled, ongoing, completed, cancelled)
- Quick actions (Join, Continue, Review)

### Problems
- Browse all available coding problems
- Filter by difficulty level
- View problem details and tags

### Interview
- Real-time code editor with syntax highlighting
- Problem statement on the left
- Code execution with output display
- Live chat with interviewer
- Language selection (Python, JavaScript, Java, C++, C)

## API Integration

The frontend communicates with the backend via:

### REST API
- Authentication endpoints
- Problem CRUD operations
- Interview management
- Solution submission

### WebSocket Events
- Real-time code updates
- Chat messages
- Cursor position tracking
- Test execution results
- User join/leave events

## State Management

Using Zustand for global state:

- `useAuthStore`: User authentication state
- `useInterviewStore`: Current interview and interview list
- `useEditorStore`: Code editor state
- `useWebSocketStore`: WebSocket connection and messages

## Components

### CodeEditor
- Syntax highlighting with Monaco Editor
- Language selection
- Real-time code synchronization

### ChatPanel
- Real-time messaging
- Message history
- User-identified messages

### OutputPanel
- Code execution button
- Output display
- Error handling

### ProblemStatement
- Problem title and difficulty
- Full description
- Sample input/output
- Test cases

## Styling

The frontend uses Tailwind CSS for styling with a blue and green color scheme:
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)

## Development Notes

- Token stored in localStorage for persistence
- Auto-connect to WebSocket on interview page
- Protected routes require authentication
- Real-time code updates across all interview participants

## Future Enhancements

- [ ] User profile customization
- [ ] Interview history and analytics
- [ ] Code syntax themes
- [ ] Keyboard shortcuts
- [ ] Test case visualization
- [ ] Performance metrics
- [ ] Dark mode support
- [ ] Accessibility improvements
