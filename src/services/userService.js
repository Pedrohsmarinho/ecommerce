const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async createUser(data) {
    const passHash = await bcrypt.hash(data.password, 10);
    return UserRepository.create({...data, password: passHash });
  },

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    const validPassword = await bcrypt.compare(password, user.password );
    if (!validPassword) throw new Error('Credenciais inválidas');

    return jwt.sign({
      id: user.id,
      type: user.type,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }
};
