const UserService = require('../services/UserService');

class UserController {
  async register(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      await UserService.verifyEmail(token);
      return res.status(200).json({ message: 'Email verificado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;
      const auth = await UserService.authenticate(email, password);
      return res.json(auth);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new UserController(); 