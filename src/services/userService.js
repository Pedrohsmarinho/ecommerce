const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/database');
const { jwt: jwtConfig } = require('../config/auth');
const EmailService = require('./EmailService');

class UserService {
  async createUser(userData) {
    const { email, password, name, type = 'CLIENT' } = userData;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const emailVerifyToken = crypto.randomBytes(20).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        type,
        emailVerifyToken
      }
    });

    await EmailService.sendVerificationEmail(email, emailVerifyToken);

    return user;
  }

  async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token }
    });

    if (!user) {
      throw new Error('Token inválido');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null
      }
    });

    return true;
  }

  async authenticate(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!user.emailVerified) {
      throw new Error('Email não verificado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
      { id: user.id, type: user.type },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      token
    };
  }
}

module.exports = new UserService();