const router = require('express').Router();
const authController = require('../../controllers/authController');
const passport = require('../../configs/passport');

router.get('/check-duplicate', authController.checkDuplicateInfo);


router.post('/register', authController.register);

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.status(200).json({
        data: {
            id: req.user.id,
        }
    })
})

module.exports = router;