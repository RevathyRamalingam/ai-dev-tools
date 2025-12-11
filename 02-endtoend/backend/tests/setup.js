// Test setup and teardown
const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Sync database in test mode
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

afterEach(async () => {
  // Clear all tables after each test
  const tables = Object.keys(sequelize.models);
  for (let table of tables) {
    await sequelize.models[table].destroy({ where: {} });
  }
});
