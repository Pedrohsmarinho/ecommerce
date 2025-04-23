const UserService = require('../UserService');
const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../../config/auth');

jest.mock('../../config/database');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'CLIENT',
        emailVerified: false,
        emailVerifyToken: 'token123'
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const result = await UserService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('deve lançar erro se o email já existir', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(
        UserService.createUser({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('authenticate', () => {
    it('deve autenticar usuário com sucesso', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        type: 'CLIENT',
        emailVerified: true
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const result = await UserService.authenticate('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        type: mockUser.type
      });
    });

    it('deve lançar erro se o usuário não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        UserService.authenticate('test@example.com', 'password123')
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar erro se o email não estiver verificado', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        emailVerified: false
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        UserService.authenticate('test@example.com', 'password123')
      ).rejects.toThrow('Email não verificado');
    });

    it('deve lançar erro se a senha estiver incorreta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        emailVerified: true
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.authenticate('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Senha incorreta');
    });
  });
}); 