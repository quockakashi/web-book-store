const authController = require('../controllers/authController');
const passport = require('../configs/passport');

const router = require('express').Router();

// register an account
router.post('/register', authController.registerAccount)

// confirm email 
router.get('/confirm-token/:token', authController.confirmAccountByMail);

// login
router.post('/login', passport.authenticate('local', {session: false}), authController.loginUser);

module.exports = router;