import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from './config/config.js';
import { initializeDatabase } from './config/database.js';
import { errorHandler } from './middleware/index.js';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import { setupWebSocket } from './websocket/index.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/interviews', interviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// WebSocket setup
setupWebSocket(io);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    httpServer.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
