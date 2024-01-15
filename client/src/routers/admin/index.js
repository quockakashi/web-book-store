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
const orderRouter = require('./orderRouter');
const orderApiRouter = require('./api/orderApiRouter');
const profileRouter = require('./profileRouter');
const reviewApiRouter = require('./api/reviewApiRouter');


/** views */
router.use('/', authRouter);
router.use('/', dashboardRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/profile', profileRouter);


/** api  */
router.use('/api/auth', authApiRouter);
router.use('/api/users', userApiRouter);
router.use('/api/categories', categoryApiRouter);
router.use('/api/products', productApiRouter);
router.use('/api/orders', orderApiRouter);
router.use('/api/reviews', reviewApiRouter);

module.exports = router;