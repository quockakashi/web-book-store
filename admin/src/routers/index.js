const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const authApiRouter = require('./authApiRouter');
const dashboardRouter = require('./dashboardRouter');
const userApiRouter = require('./userApiRouter');
const categoryRouter = require('./categoryRouter');
const categoryApiRouter = require('./categoryApiRouter');


/** views */
router.use('/', authRouter);
router.use('/home', dashboardRouter);
router.use('/users', userRouter);
router.get('/', async(req, res) => {
    res.redirect('/home');
})
router.use('/categories', categoryRouter)


/** api  */
router.use('/api/auth', authApiRouter);
router.use('/api/users', userApiRouter);
router.use('/api/categories', categoryApiRouter);

module.exports = router;