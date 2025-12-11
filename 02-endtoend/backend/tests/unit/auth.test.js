import { sequelize } from '../../src/config/database.js';
import { User } from '../../src/models/index.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../src/config/auth.js';

describe('Auth Unit Tests', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should create different hashes for same password', async () => {
      const password = 'myPassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should verify correct password', async () => {
      const password = 'myPassword';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should reject wrong password', async () => {
      const password = 'myPassword';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword('wrongPassword', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format
    });

    it('should generate different tokens for same payload', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token1 = generateToken(payload);
      const token2 = generateToken(payload);

      // Tokens will be different due to iat (issued at) claim
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe('test@example.com');
    });

    it('should reject an invalid token', () => {
      const decoded = verifyToken('invalid.token.here');

      expect(decoded).toBe(null);
    });

    it('should reject a tampered token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      const tamperedToken = token.substring(0, token.length - 5) + 'tamper';
      const decoded = verifyToken(tamperedToken);

      expect(decoded).toBe(null);
    });
  });

  describe('User Model', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
    });

    afterAll(async () => {
      await sequelize.close();
    });

    it('should create a user', async () => {
      const user = await User.create({
        email: 'create@example.com',
        username: 'createuser',
        fullName: 'Create User',
        password: 'hashed_password',
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('create@example.com');
    });

    it('should enforce unique email constraint', async () => {
      await User.create({
        email: 'unique@example.com',
        username: 'user1',
        fullName: 'User One',
        password: 'password',
      });

      expect(async () => {
        await User.create({
          email: 'unique@example.com',
          username: 'user2',
          fullName: 'User Two',
          password: 'password',
        });
      }).rejects.toThrow();
    });

    it('should set default role to candidate', async () => {
      const user = await User.create({
        email: 'defaultrole@example.com',
        username: 'defaultuser',
        fullName: 'Default User',
        password: 'password',
      });

      expect(user.role).toBe('candidate');
    });

    it('should set isActive to true by default', async () => {
      const user = await User.create({
        email: 'active@example.com',
        username: 'activeuser',
        fullName: 'Active User',
        password: 'password',
      });

      expect(user.isActive).toBe(true);
    });
  });
});
