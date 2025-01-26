const request = require('supertest');
const app = require('../app'); // Your Express app
const Project = require('../models/project');
const User = require('../models/user');
const BlacklistedToken = require('../models/blacklistedToken');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Mock Project, User, and BlacklistedToken model methods
jest.mock('../models/user', () => ({
  findById: jest.fn().mockResolvedValue({
    _id: '64fca8e8f9c0123456789013',
    username: 'john_doe',
    email: 'john.doe@example.com',
    role: 'owner'
  }),
}));

jest.mock('../models/blacklistedToken', () => ({
  create: jest.fn(),
  findOne: jest.fn().mockResolvedValue(null), // Mock token not blacklisted
}));

let token;
let userId = '64fca8e8f9c0123456789013';
let projectId = '64fca8e8f9c0123456789012';

jest.mock('../models/project', () => ({
  create: jest.fn(),
  findById: jest.fn().mockResolvedValue({
    _id: '64fca8e8f9c0123456789012',
    name: 'Project Alpha',
    description: 'A new project',
    owner: '64fca8e8f9c0123456789013',
    members: ['64fca8e8f9c0123456789013']
  }),
  findByIdAndUpdate: jest.fn().mockResolvedValue({
    _id: '64fca8e8f9c0123456789012',
    name: 'Project Alpha',
    description: 'A new project',
    owner: '64fca8e8f9c0123456789013',
    members: ['64fca8e8f9c0123456789013', '64fca8e8f9c0123456789014']
  }),
}));

describe('Project Routes', () => {

  beforeAll(() => {
    token = jwt.sign({ id: userId, role: 'owner' }, JWT_SECRET, { expiresIn: '7d' });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('POST /api/project', () => {
    it('should create a new project successfully', async () => {
      // Arrange
      const projectInput = {
        name: 'Project Alpha',
        description: 'A new project'
      };

      Project.create.mockResolvedValue({
        _id: '64fca8e8f9c0123456789012',
        name: 'Project Alpha',
        description: 'A new project',
        owner: '64fca8e8f9c0123456789013',
        members: ['64fca8e8f9c0123456789013']
      });

      // Act
      const response = await request(app)
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(projectInput);

      // Assert
      console.log('Response:', response.body); // Add logging
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project created successfully');
      expect(response.body.data).toMatchObject({
        _id: '64fca8e8f9c0123456789012',
        name: 'Project Alpha',
        description: 'A new project',
        owner: '64fca8e8f9c0123456789013',
        members: ['64fca8e8f9c0123456789013']
      });
    }, 15000); // Increase timeout to 15000 ms
  });

  describe('POST /api/project/invite', () => {
    it('should invite a member to the project successfully', async () => {
      // Arrange
      const inviteInput = {
        projectId: '64fca8e8f9c0123456789012',
        memberId: '64fca8e8f9c0123456789014'
      };

      Project.findByIdAndUpdate.mockResolvedValue({
        _id: '64fca8e8f9c0123456789012',
        members: ['64fca8e8f9c0123456789013', '64fca8e8f9c0123456789014']
      });

      // Act
      const response = await request(app)
        .post('/api/project/invite')
        .set('Authorization', `Bearer ${token}`)
        .send(inviteInput);

      // Assert
      console.log('Response:', response.body); // Add logging
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Member invited successfully');
      expect(response.body.data).toMatchObject({
        _id: '64fca8e8f9c0123456789012',
        members: ['64fca8e8f9c0123456789013', '64fca8e8f9c0123456789014']
      });
    }, 15000); // Increase timeout to 15000 ms
  });

  describe('POST /api/project/make-manager', () => {
    it('should promote a member to manager successfully', async () => {
      // Arrange
      const makeManagerInput = {
        projectId: '64fca8e8f9c0123456789012',
        memberId: '64fca8e8f9c0123456789014'
      };

      Project.findByIdAndUpdate.mockResolvedValue({
        _id: '64fca8e8f9c0123456789012',
        name: 'Project Alpha',
        description: 'A new project',
        owner: '64fca8e8f9c0123456789013',
        managers: ['64fca8e8f9c0123456789014'],
        members: ['64fca8e8f9c0123456789013', '64fca8e8f9c0123456789014']
      });

      // Act
      const response = await request(app)
        .post('/api/project/make-manager')
        .set('Authorization', `Bearer ${token}`)
        .send(makeManagerInput);

      // Assert
      console.log('Response:', response.body); // Add logging
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Member promoted to manager successfully');
      expect(response.body.data).toMatchObject({
        _id: '64fca8e8f9c0123456789012',
        managers: ['64fca8e8f9c0123456789014']
      });
    }, 15000); // Increase timeout to 15000 ms
  });
});
