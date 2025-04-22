const UserService = require('../services/userService');

module.exports = {
  async create(req, res) {
    const data = req.body;
    const result = await UserService.create(data);
 
    if (!result) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    res.status(201).json(result);
  },

  async login(req, res) {
    const { email, password } = req.body;
    const token = await UserService.login(email, password);

    if (!token) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({ token });
  }
};
