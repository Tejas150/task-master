const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Your Express app
const User = require('../models/user');
const BlacklistedToken = require('../models/blacklistedToken');

// Mock User and BlacklistedToken model methods
jest.mock('../models/user', () => {
  const originalModule = jest.requireActual('../models/user');
  return {
    ...originalModule,
    findOne: jest.fn(),
    findById: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software Developer',
          location: 'New York',
          phoneNumber: '1234567890'
        }
      })
    }),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  };
});

jest.mock('../models/blacklistedToken', () => ({
  create: jest.fn(),
  findOne: jest.fn(), // Add findOne mock
}));

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  const mockToken = jwt.sign({ id: 'mockUserId', role: 'attendee' }, 's2dgfgre41vet5t5gvxfbfh41', { expiresIn: '7d' });

  describe('POST /api/user/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userInput = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software Developer',
          location: 'New York',
          phoneNumber: '1234567890'
        }
      };

      User.findOne.mockResolvedValue(null); // Mock no existing user
      User.create.mockResolvedValue({
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        role: 'attendee',
        profile: userInput.profile
      });

      // Act
      const response = await request(app).post('/api/user/register').send(userInput);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toMatchObject({
        id: 'mockUserId',
        email: 'john.doe@example.com',
        role: 'attendee',
      });
    });

    it('should return an error if the user already exists', async () => {
      // Arrange
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        email: 'john.doe@example.com',
      }); // Mock existing user

      const userInput = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software Developer',
          location: 'New York',
          phoneNumber: '1234567890'
        }
      };

      // Act
      const response = await request(app).post('/api/user/register').send(userInput);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email or username already exists');
    });
  });

  describe('POST /api/user/login', () => {
    it('should log in a user successfully and return a token', async () => {
      // Arrange
      const userInput = {
        identifier: 'john.doe@example.com',
        password: 'password123',
      };

      const mockHashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: mockHashedPassword,
        role: 'attendee',
      });

      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken); // Mock JWT sign

      // Act
      const response = await request(app).post('/api/user/login').send(userInput);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toMatchObject({ token: mockToken });
    });

    it('should return an error for invalid email/username', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null); // Mock no user found

      const userInput = {
        identifier: 'invalid@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/api/user/login').send(userInput);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email/username or password');
    });

    it('should return an error for invalid password', async () => {
      // Arrange
      const mockHashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: mockHashedPassword,
        role: 'attendee',
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Mock password mismatch

      const userInput = {
        identifier: 'john.doe@example.com',
        password: 'wrongPassword',
      };

      // Act
      const response = await request(app).post('/api/user/login').send(userInput);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email/username or password');
    });
  });

  describe('GET /api/user/profile', () => {
    it('should fetch the user profile successfully', async () => {
      // Arrange
      const mockUser = {
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software Developer',
          location: 'New York',
          phoneNumber: '1234567890'
        }
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      }); // Mock user found
      BlacklistedToken.findOne.mockResolvedValue(null); // Mock token not blacklisted

      // Act
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User profile fetched successfully');
      expect(response.body.data).toMatchObject({
        username: 'john_doe',
        email: 'john.doe@example.com',
        profile: mockUser.profile
      });
    });

    it('should return an error if the user is not found', async () => {
      // Arrange
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      }); // Mock no user found
      BlacklistedToken.findOne.mockResolvedValue(null); // Mock token not blacklisted

      // Act
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update the user profile successfully', async () => {
      // Arrange
      const userInput = {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Senior Software Developer',
          location: 'San Francisco',
          phoneNumber: '0987654321'
        }
      };

      const mockUser = {
        _id: 'mockUserId',
        username: 'john_doe',
        email: 'john.doe@example.com',
        profile: userInput.profile
      };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      }); // Mock user updated
      BlacklistedToken.findOne.mockResolvedValue(null); // Mock token not blacklisted

      // Act
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(userInput);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User profile updated successfully');
      expect(response.body.data).toMatchObject({
        username: 'john_doe',
        email: 'john.doe@example.com',
        profile: userInput.profile
      });
    });

    it('should return an error if the user is not found', async () => {
      // Arrange
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      }); // Mock no user found
      BlacklistedToken.findOne.mockResolvedValue(null); // Mock token not blacklisted

      const userInput = {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Senior Software Developer',
          location: 'San Francisco',
          phoneNumber: '0987654321'
        }
      };

      // Act
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(userInput);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/user/logout', () => {
    it('should log out the user and blacklist the token', async () => {
      // Arrange
      BlacklistedToken.create.mockResolvedValue({}); // Mock token blacklisted
      BlacklistedToken.findOne.mockResolvedValue(null); // Mock token not blacklisted

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'mockUserId',
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'attendee',
        })
      }); // Mock user found

      // Act
      const response = await request(app)
        .post('/api/user/logout')
        .set('Authorization', `Bearer ${mockToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });
  });
});
