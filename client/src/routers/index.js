const router = require('express').Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const {redirectConfirmPage, requireLogin} = require('../middlewares/handleLoginUser')


const productApiRouter = require('./api/productApiRouter');
const categoryApiRouter = require('./api/categoryApiRouter');
const authApiRouter = require('./api/authApiRouter');
const passport = require('../configs/passport');
const reviewApiRouter = require('./api/reviewApiRouter');
const orderApiRouter = require('./api/orderApiRouter');


router.get('/', redirectConfirmPage, productController.renderHomePage);
router.get('/books/:id', productController.renderProductDetails);
router.get('/books', productController.renderSearchBookPage);
router.get('/register', authController.renderRegisterPage);
router.get('/confirm-email', authController.renderConfirmEmailPage);
router.get('/confirm-token/:token', authController.confirmToken);
router.get('/login', authController.renderLoginPage);
router.get('/logout', (req, res, next) => {
    req.logOut(function(error) {
        if(error) {
            return next(error);
        }
        res.redirect('/login');
    });
})
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
}));
router.get('/account', requireLogin, (req, res, next) => {
    res.render('detail-user-page', {layout: 'layouts/main', title: 'My account', user: req.user})
})


router.use('/api/products', productApiRouter);

router.use('/api/categories', categoryApiRouter);
router.use('/api/auth', authApiRouter);
router.use('/api/reviews', reviewApiRouter);
router.use('/api/orders', orderApiRouter);




module.exports = router;