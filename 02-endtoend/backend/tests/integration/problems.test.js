const request = require('supertest');
const { sequelize, Problem, User } = require('../../src/models');
const app = require('../../src/server');

describe('Problems Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Create and authenticate user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        name: 'Test User',
        password: 'password123',
      });
    userId = registerRes.body.user.id;
    authToken = registerRes.body.token;
  });

  afterEach(async () => {
    await Problem.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /api/problems', () => {
    beforeEach(async () => {
      await Problem.bulkCreate([
        {
          title: 'Two Sum',
          description: 'Find two numbers that add up to target',
          difficulty: 'easy',
          tags: ['array'],
          sampleInput: '[2,7,11,15], target=9',
          sampleOutput: '[0,1]',
          testCases: [],
        },
        {
          title: 'Merge Sorted Arrays',
          description: 'Merge two sorted arrays',
          difficulty: 'medium',
          tags: ['array', 'merge'],
          sampleInput: '[1,3], [2,4]',
          sampleOutput: '[1,2,3,4]',
          testCases: [],
        },
        {
          title: 'Longest Substring',
          description: 'Find longest substring without repeating characters',
          difficulty: 'hard',
          tags: ['string', 'sliding-window'],
          sampleInput: 'abcabcbb',
          sampleOutput: 'abc',
          testCases: [],
        },
      ]);
    });

    it('should get all problems', async () => {
      const res = await request(app).get('/api/problems');

      expect(res.statusCode).toBe(200);
      expect(res.body.problems).toHaveLength(3);
    });

    it('should get problems with pagination', async () => {
      const res = await request(app).get('/api/problems?page=1&limit=2');

      expect(res.statusCode).toBe(200);
      expect(res.body.problems).toHaveLength(2);
      expect(res.body.pages).toBeGreaterThan(1);
    });

    it('should filter problems by difficulty', async () => {
      const res = await request(app).get('/api/problems?difficulty=easy');

      expect(res.statusCode).toBe(200);
      expect(res.body.problems).toHaveLength(1);
      expect(res.body.problems[0].difficulty).toBe('easy');
    });

    it('should get specific problem by ID', async () => {
      const allRes = await request(app).get('/api/problems');
      const problemId = allRes.body.problems[0].id;

      const res = await request(app).get(`/api/problems/${problemId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Two Sum');
    });
  });

  describe('POST /api/problems', () => {
    it('should create a new problem', async () => {
      const res = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Reverse String',
          description: 'Reverse a given string',
          difficulty: 'Easy',
          tags: ['string'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Reverse String');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/problems')
        .send({
          title: 'Some Problem',
          description: 'Description',
          difficulty: 'Easy',
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Problem',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/problems/:id', () => {
    let problemId;

    beforeEach(async () => {
      const problem = await Problem.create({
        title: 'Update Test',
        description: 'Original description',
        difficulty: 'Easy',
        tags: [],
      });

      problemId = problem.id;
    });

    it('should update a problem', async () => {
      const res = await request(app)
        .put(`/api/problems/${problemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Updated description',
          difficulty: 'Medium',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.description).toBe('Updated description');
      expect(res.body.difficulty).toBe('Medium');
    });

    it('should fail if problem not found', async () => {
      const res = await request(app)
        .put('/api/problems/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Updated' });

      expect(res.statusCode).toBe(404);
    });
  });
});
