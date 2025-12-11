import { sequelize } from '../../src/config/database.js';
import { Problem } from '../../src/models/index.js';

describe('Problem Model Unit Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Problem Creation', () => {
    it('should create a problem with all fields', async () => {
      const problem = await Problem.create({
        title: 'Array Sum',
        description: 'Calculate the sum of array elements',
        difficulty: 'easy',
        tags: ['array', 'math'],
        sampleInput: '[1, 2, 3, 4]',
        sampleOutput: '10',
        testCases: [{ input: '[1,2,3]', output: '6' }],
      });

      expect(problem.id).toBeDefined();
      expect(problem.title).toBe('Array Sum');
      expect(problem.difficulty).toBe('easy');
      expect(problem.tags).toEqual(['array', 'math']);
    });

    it('should require title', async () => {
      expect(async () => {
        await Problem.create({
          description: 'No title',
          difficulty: 'easy',
        });
      }).rejects.toThrow();
    });

    it('should require difficulty', async () => {
      expect(async () => {
        await Problem.create({
          title: 'Missing difficulty',
          description: 'No difficulty',
        });
      }).rejects.toThrow();
    });
  });

  describe('Problem Difficulty Validation', () => {
    it('should accept easy difficulty', async () => {
      const problem = await Problem.create({
        title: 'Easy Problem',
        description: 'An easy problem',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.difficulty).toBe('easy');
    });

    it('should accept medium difficulty', async () => {
      const problem = await Problem.create({
        title: 'Medium Problem',
        description: 'A medium problem',
        difficulty: 'medium',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.difficulty).toBe('medium');
    });

    it('should accept hard difficulty', async () => {
      const problem = await Problem.create({
        title: 'Hard Problem',
        description: 'A hard problem',
        difficulty: 'hard',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.difficulty).toBe('hard');
    });
  });

  describe('Problem Tags', () => {
    it('should store tags as array', async () => {
      const problem = await Problem.create({
        title: 'Tagging Test',
        description: 'Test tags storage',
        difficulty: 'medium',
        tags: ['sorting', 'dynamic-programming', 'graph'],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(Array.isArray(problem.tags)).toBe(true);
      expect(problem.tags).toEqual(['sorting', 'dynamic-programming', 'graph']);
    });

    it('should default tags to empty array', async () => {
      const problem = await Problem.create({
        title: 'No Tags',
        description: 'Problem without tags',
        difficulty: 'easy',
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.tags).toEqual([]);
    });
  });

  describe('Problem Test Cases', () => {
    it('should store test cases as JSON', async () => {
      const testCases = [
        { input: '5', output: 'true' },
        { input: '10', output: 'false' },
      ];

      const problem = await Problem.create({
        title: 'Test Cases Problem',
        description: 'Problem with test cases',
        difficulty: 'medium',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases,
      });

      expect(problem.testCases).toEqual(testCases);
    });

    it('should allow empty test cases', async () => {
      const problem = await Problem.create({
        title: 'Empty Test Cases',
        description: 'No test cases',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.testCases).toEqual([]);
    });
  });

  describe('Problem Timestamps', () => {
    it('should automatically set createdAt', async () => {
      const beforeCreate = new Date();
      const problem = await Problem.create({
        title: 'Timestamp Test',
        description: 'Test timestamps',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });
      const afterCreate = new Date();

      expect(problem.createdAt).toBeDefined();
      expect(problem.createdAt).toBeGreaterThanOrEqual(beforeCreate);
      expect(problem.createdAt).toBeLessThanOrEqual(afterCreate);
    });

    it('should automatically set updatedAt', async () => {
      const problem = await Problem.create({
        title: 'Updated Problem',
        description: 'Test update timestamp',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      expect(problem.updatedAt).toBeDefined();
      expect(problem.updatedAt).toEqual(problem.createdAt);
    });

    it('should update updatedAt when modified', async () => {
      const problem = await Problem.create({
        title: 'Modify Test',
        description: 'Original description',
        difficulty: 'easy',
        tags: [],
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
      });

      const originalUpdatedAt = problem.updatedAt;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 10));
      await problem.update({ description: 'Modified description' });

      expect(problem.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });
  });
});
