const nodemailer = require('nodemailer');
const { email: emailConfig } = require('../config/auth');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      auth: emailConfig.auth
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: emailConfig.from,
      to: email,
      subject: 'Verificação de Email - E-commerce',
      html: `
        <h1>Bem-vindo ao E-commerce!</h1>
        <p>Por favor, clique no link abaixo para verificar seu email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `
    });
  }
}

module.exports = new EmailService();