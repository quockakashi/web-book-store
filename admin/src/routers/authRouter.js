const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/login', authController.renderLoginPage);

module.exports = router;