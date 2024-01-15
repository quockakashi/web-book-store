const router = require('express').Router();
const authController = require('../../controllers/admin/authController');

router.get('/login', authController.renderLoginPage);

module.exports = router;