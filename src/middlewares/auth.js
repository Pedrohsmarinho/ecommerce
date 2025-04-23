const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/auth');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.userId = decoded.id;
    req.userType = decoded.type;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.userType !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  return next();
}

module.exports = { authMiddleware, adminMiddleware }; 