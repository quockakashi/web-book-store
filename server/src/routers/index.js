const router = require('express').Router();
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const passport = require('../configs/passport');

router.use('/users', passport.authenticate('jwt', {session: false}), userRouter);
router.use('/auth', authRouter);

module.exports = router;