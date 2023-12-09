const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const authApiRouter = require('./authApiRouter');
const dashboardRouter = require('./dashboardRouter');
const userApiRouter = require('./userApiRouter');


/** views */
router.use('/', authRouter);
router.use('/home', dashboardRouter);
router.use('/users', userRouter);
router.get('/', async(req, res) => {
    res.redirect('/home');
})


/** api  */
router.use('/api/auth', authApiRouter);
router.use('/api/users', userApiRouter);

module.exports = router;