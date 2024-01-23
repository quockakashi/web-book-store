const router = require('express').Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const { redirectConfirmPage, requireLogin, requireAdmin } = require('../middlewares/handleLoginUser')
const jwt = require('jsonwebtoken');


const productApiRouter = require('./api/productApiRouter');
const categoryApiRouter = require('./api/categoryApiRouter');
const authApiRouter = require('./api/authApiRouter');
const passport = require('../configs/passport');
const reviewApiRouter = require('./api/reviewApiRouter');
const orderApiRouter = require('./api/orderApiRouter');
const vnpayApiRouter = require('./api/vnpayApiRouter');
const userApiRouter = require('./api/userRouter');
// admin
const adminRouter = require('./admin/index');


router.get('/', redirectConfirmPage, productController.renderHomePage);
router.get('/books/:id', productController.renderProductDetails);
router.get('/books', productController.renderSearchBookPage);
router.get('/register', authController.renderRegisterPage);
router.get('/confirm-email', authController.renderConfirmEmailPage);
router.get('/confirm-token/:token', authController.confirmToken);
router.get('/login', authController.renderLoginPage);
router.get('/logout', (req, res, next) => {
    req.logOut(function (error) {
        if (error) {
            return next(error);
        }
        res.redirect('/login');
    });
})
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
}));
router.get('/account', requireLogin, (req, res, next) => {
    res.render('detail-user-page', { layout: 'layouts/main', title: 'My account', user: req.user })
})

router.get('/transaction-status', (req, res) => {
    const type = req.flash('type')[0];
    const status = req.flash('status')[0];
    var amount = req.flash('amount')[0];
    var transaction = req.flash('transaction')[0];
    console.log(type);

    res.render('transaction-status', { layout: 'layouts/main', title: 'Transaction status', user: req.user, type, status, amount, transaction});
})
router.get('/cart', requireLogin, function(req, res){
    res.render('cart', { layout: 'layouts/main', title: 'Transaction status', user: req.user});
});

router.get('/wallet',requireLogin, async function(req, res) {
    
    const userWallet = req.user.wallet;
    const body = {
        walletId: userWallet,
    }

    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/wallet/balance`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;
    req.user.balance = data.balance;

    res.render('my-wallet',  { layout: 'layouts/main', title: 'My wallet', user: req.user})
})

router.get('/api/payment/balance', async(req, res, next) => {
    const userWallet = req.user.wallet;
    const body = {
        walletId: userWallet,
    }

    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/wallet/balance`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        id: req.user._id,
        balance: data.balance,
    })
});


router.get('/api/payment/transactions', async(req, res, next) => {
    const userWallet = req.user.wallet;
    const body = {
        walletId: userWallet,
    }

    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/transactions/by-wallet`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        data: {
            userId: req.user._id,
            transactions: data,
        }
    })
});

router.get('/api/payment/transactions/overview', async(req, res, next) => {
    const userWallet = req.user.wallet;
    const { by } = req.query;
    const body = {
        walletId: userWallet,
        duration: by,
    }

    const walletResponse = await fetch(`${process.env.PAYMENT_DOMAIN}/api/transactions/overview`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: jwt.sign(body, process.env.TRANSACTION_SECRET_KEY)
    })});

    const data = (await walletResponse.json()).data;

    res.status(200).json({
        data: {
            userId: req.user._id,
            data,
        }
    })
});



router.use('/api/products', productApiRouter);

router.use('/api/categories', categoryApiRouter);
router.use('/api/auth', authApiRouter);
router.use('/api/reviews', reviewApiRouter);
router.use('/api/orders', orderApiRouter);


router.use('/admin', requireLogin, requireAdmin, adminRouter);


router.use('/api/vn-pay/', vnpayApiRouter);
router.use('/api/users', userApiRouter);

module.exports = router;