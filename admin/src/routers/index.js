const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const authApiRouter = require('./api/authApiRouter');
const dashboardRouter = require('./dashboardRouter');
const userApiRouter = require('./api/userApiRouter');
const categoryRouter = require('./categoryRouter');
const categoryApiRouter = require('./api/categoryApiRouter');
const productRouter = require('./productRouter');
const productApiRouter = require('./api/productApiRouter');


/** views */
router.use('/', authRouter);
router.use('/home', dashboardRouter);
router.use('/users', userRouter);
router.get('/', async(req, res) => {
    res.redirect('/home');
})
router.use('/categories', categoryRouter);
router.use('/products', productRouter);


/** api  */
router.use('/api/auth', authApiRouter);
router.use('/api/users', userApiRouter);
router.use('/api/categories', categoryApiRouter);
router.use('/api/products', productApiRouter);

module.exports = router;