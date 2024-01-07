const router = require('express').Router();
const authController = require('../../controllers/authController');

router.get('/check-duplicate', authController.checkDuplicateInfo);


router.post('/register', authController.register);

module.exports = router;