import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  dbPath: process.env.DB_PATH || './database.sqlite',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5000'],
  
  // Code execution
  maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME) || 30,
  maxMemory: parseInt(process.env.MAX_MEMORY) || 512,
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'session-secret-key',
};

export default config;
