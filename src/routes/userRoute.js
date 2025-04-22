const { Router } = require('express');
const UserController = require('../controllers/userController'); 

const router = Router();

router.post('/', UserController.create);
router.post('/login', UserController.login);

module.exports = router;
