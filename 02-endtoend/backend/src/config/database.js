import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.dbPath,
  logging: config.nodeEnv === 'development' ? console.log : false,
  models: [__dirname + '/../models/**/*.js'],
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
}

export default sequelize;
