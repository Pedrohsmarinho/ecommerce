module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key-dev-only',
    expiresIn: '1d'
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
}; 