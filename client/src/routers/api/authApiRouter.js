const router = require('express').Router();
const authController = require('../../controllers/authController');
const passport = require('../../configs/passport');

router.get('/check-duplicate', authController.checkDuplicateInfo);


router.post('/register', authController.register);

router.post('/login', passport.authenticate('local'), passport.authenticate('local'), async (req, res, next) => {
    try {
        const { rememberMe } = req.body;
        if(rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    };

    return res.status(200).json({
        data: {
            id: req.user._id,
            username: req.user.username,
            fullName: req.user.fullName,
        }
    })
    } catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;