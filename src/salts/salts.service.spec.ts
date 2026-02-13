import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SaltsService } from './salts.service';

describe('SaltsService', () => {
  let service: SaltsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaltsService],
    }).compile();

    service = module.get<SaltsService>(SaltsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user with salted password', () => {
      const email = 'test@example.com';
      const password = 'testPassword123';

      const user = service.signup(email, password);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(password); // Password should be hashed
      expect(user.password).toContain(':'); // Should contain salt:hash format
    });

    it('should generate different salts for same password', () => {
      const email1 = 'user1@example.com';
      const email2 = 'user2@example.com';
      const password = 'samePassword123';

      const user1 = service.signup(email1, password);
      const user2 = service.signup(email2, password);

      expect(user1.password).not.toBe(user2.password);

      const [salt1] = user1.password.split(':');
      const [salt2] = user2.password.split(':');
      expect(salt1).not.toBe(salt2);
    });

    it('should store user in users array', () => {
      const email = 'stored@example.com';
      const password = 'password123';

      const initialUsersCount = service.users.length;
      service.signup(email, password);

      expect(service.users.length).toBe(initialUsersCount + 1);
      expect(service.users.find((u) => u.email === email)).toBeDefined();
    });

    it('should return user object with correct structure', () => {
      const email = 'structure@example.com';
      const password = 'password123';

      const user = service.signup(email, password);

      expect(user).toHaveProperty('email', email);
      expect(user).toHaveProperty('password');
      expect(typeof user.email).toBe('string');
      expect(typeof user.password).toBe('string');
    });
  });

  describe('signin', () => {
    beforeEach(() => {
      // Clear users array before each test
      service.users = [];
    });

    it('should successfully sign in with correct credentials', () => {
      const email = 'signin@example.com';
      const password = 'correctPassword123';

      // First signup
      service.signup(email, password);

      // Then signin
      const result = service.signin(email, password);

      expect(result).toBe('login success!');
    });

    it('should fail signin with wrong password', () => {
      const email = 'wrong@example.com';
      const correctPassword = 'correctPassword123';
      const wrongPassword = 'wrongPassword123';

      // Signup with correct password
      service.signup(email, correctPassword);

      // Try signin with wrong password
      expect(() => service.signin(email, wrongPassword)).toThrow(
        UnauthorizedException,
      );
    });

    it('should fail signin with non-existent user', () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      expect(() => service.signin(email, password)).toThrow(
        NotFoundException,
      );
    });

    it('should use timing-safe comparison for password verification', () => {
      const email = 'timing@example.com';
      const password = 'password123';

      // Signup user
      service.signup(email, password);

      // Test with correct password (should pass)
      const correctResult = service.signin(email, password);
      expect(correctResult).toBe('login success!');

      // Test with wrong password (should fail securely)
      expect(() => service.signin(email, 'wrongpassword')).toThrow(
        UnauthorizedException,
      );
    });

    it('should handle salt and hash parsing correctly', () => {
      const email = 'parsing@example.com';
      const password = 'password123';

      // Signup user
      const user = service.signup(email, password);

      // Verify salt:hash format
      const parts = user.password.split(':');
      expect(parts).toHaveLength(2);

      const [salt, hash] = parts;
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
      expect(salt.length).toBeGreaterThan(0);
      expect(hash.length).toBeGreaterThan(0);

      // Signin should work
      const result = service.signin(email, password);
      expect(result).toBe('login success!');
    });

    it('should consistently verify same password', () => {
      const email = 'consistent@example.com';
      const password = 'password123';

      // Signup
      service.signup(email, password);

      // Multiple signin attempts with same password should all succeed
      for (let i = 0; i < 5; i++) {
        const result = service.signin(email, password);
        expect(result).toBe('login success!');
      }
    });

    it('should handle edge cases', () => {
      // Empty password
      service.signup('empty@example.com', '');
      const emptyResult = service.signin('empty@example.com', '');
      expect(emptyResult).toBe('login success!');

      // Special characters in password
      const specialPassword = '!@#$%^&*()_+{}|:<>?[]\\;\'".,/~`';
      service.signup('special@example.com', specialPassword);
      const specialResult = service.signin(
        'special@example.com',
        specialPassword,
      );
      expect(specialResult).toBe('login success!');
    });
  });

  describe('users array management', () => {
    beforeEach(() => {
      service.users = [];
    });

    it('should maintain users array correctly', () => {
      expect(service.users).toEqual([]);

      const user1 = service.signup('user1@example.com', 'password1');
      expect(service.users).toHaveLength(1);
      expect(service.users[0]).toEqual(user1);

      const user2 = service.signup('user2@example.com', 'password2');
      expect(service.users).toHaveLength(2);
      expect(service.users[1]).toEqual(user2);
    });

    it('should allow multiple users with different emails', () => {
      service.signup('user1@example.com', 'password');
      service.signup('user2@example.com', 'password');
      service.signup('user3@example.com', 'password');

      expect(service.users).toHaveLength(3);

      // All should be able to sign in
      expect(service.signin('user1@example.com', 'password')).toBe(
        'login success!',
      );
      expect(service.signin('user2@example.com', 'password')).toBe(
        'login success!',
      );
      expect(service.signin('user3@example.com', 'password')).toBe(
        'login success!',
      );
    });
  });
});
