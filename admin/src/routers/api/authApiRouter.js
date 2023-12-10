const authController = require('../../controllers/authController');
const passport = require('../../configs/passport');

const router = require('express').Router();

// register an account
router.post('/register', authController.registerAccount)

// confirm email 
router.get('/confirm-token/:token', authController.confirmAccountByMail);

// login
router.post('/login', passport.authenticate('local'), async (req, res, next) => {
    try {
        const { rememberMe } = req.body;
        if(rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    };
    res.redirect('/home');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;