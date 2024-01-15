const authController = require('../../../controllers/admin/authController');
const passport = require('../../../configs/passport');

const router = require('express').Router();
const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1700707173/book-store-system/avatars/default-avatar.png';

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

    return res.status(200).json({
        user: {
            username: req.user.username,
            fullName: req.user.fullName,
            avatar: req.user.avatar.public_id ? req.user.avatar.url : DEFAULT_AVATAR_URL,
        }
    })
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;