const request = require('supertest');
const { sequelize, User, Problem, Interview, Solution } = require('../../src/models');
const app = require('../../src/server');

describe('Interview Integration Tests', () => {
  let interviewerToken, candidateToken;
  let interviewerId, candidateId, problemId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Create interviewer
    const interviewerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'interviewer@example.com',
        name: 'Interviewer User',
        password: 'password123',
      });

    interviewerId = interviewerRes.body.user.id;
    interviewerToken = interviewerRes.body.token;

    // Create candidate
    const candidateRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'candidate@example.com',
        name: 'Candidate User',
        password: 'password123',
      });

    candidateId = candidateRes.body.user.id;
    candidateToken = candidateRes.body.token;

    // Create problem
    const problemRes = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({
        title: 'Test Problem',
        description: 'A test problem',
        difficulty: 'Medium',
        tags: ['test'],
      });

    problemId = problemRes.body.id;
  });

  afterEach(async () => {
    await Interview.destroy({ where: {} });
    await Solution.destroy({ where: {} });
    await Problem.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('POST /api/interviews', () => {
    it('should create a new interview', async () => {
      const res = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe('scheduled');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/interviews')
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          candidateId,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/interviews/:id', () => {
    let interviewId;

    beforeEach(async () => {
      const interviewRes = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      interviewId = interviewRes.body.id;
    });

    it('should get interview by ID', async () => {
      const res = await request(app)
        .get(`/api/interviews/${interviewId}`)
        .set('Authorization', `Bearer ${interviewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(interviewId);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get(`/api/interviews/${interviewId}`);

      expect(res.statusCode).toBe(401);
    });

    it('should return 404 for non-existent interview', async () => {
      const res = await request(app)
        .get('/api/interviews/99999')
        .set('Authorization', `Bearer ${interviewerToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/interviews/user/interviews', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });
    });

    it('should get user interviews', async () => {
      const res = await request(app)
        .get('/api/interviews/user/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/interviews/:id', () => {
    let interviewId;

    beforeEach(async () => {
      const interviewRes = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      interviewId = interviewRes.body.id;
    });

    it('should update interview status', async () => {
      const res = await request(app)
        .put(`/api/interviews/${interviewId}`)
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          status: 'ongoing',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ongoing');
    });

    it('should update interview feedback and rating', async () => {
      const res = await request(app)
        .put(`/api/interviews/${interviewId}`)
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          status: 'completed',
          feedback: 'Great performance',
          rating: 4,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.feedback).toBe('Great performance');
      expect(res.body.rating).toBe(4);
    });
  });

  describe('POST /api/interviews/:id/solutions', () => {
    let interviewId;

    beforeEach(async () => {
      const interviewRes = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      interviewId = interviewRes.body.id;
    });

    it('should submit a solution', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/solutions`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'print("Hello World")',
          language: 'python',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toBeDefined();
    });

    it('should fail with missing code', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/solutions`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          language: 'python',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/interviews/:id/solutions', () => {
    let interviewId;

    beforeEach(async () => {
      const interviewRes = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      interviewId = interviewRes.body.id;

      await request(app)
        .post(`/api/interviews/${interviewId}/solutions`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'test code',
          language: 'python',
        });
    });

    it('should get interview solutions', async () => {
      const res = await request(app)
        .get(`/api/interviews/${interviewId}/solutions`)
        .set('Authorization', `Bearer ${interviewerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/interviews/:id/execute', () => {
    let interviewId;

    beforeEach(async () => {
      const interviewRes = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          problemId,
          candidateId,
          scheduledAt: new Date().toISOString(),
        });

      interviewId = interviewRes.body.id;
    });

    it('should execute Python code', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/execute`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'print("Hello, World!")',
          language: 'python',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should execute JavaScript code', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/execute`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'console.log("Hello, World!");',
          language: 'javascript',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should handle code with errors', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/execute`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'pritn("error")',
          language: 'python',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
    });

    it('should handle unsupported language', async () => {
      const res = await request(app)
        .post(`/api/interviews/${interviewId}/execute`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          code: 'code here',
          language: 'go',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
    });
  });
});
