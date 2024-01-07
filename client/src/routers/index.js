const router = require('express').Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');


const productApiRouter = require('./api/productApiRouter');
const categoryApiRouter = require('./api/categoryApiRouter');
const authApiRouter = require('./api/authApiRouter');


router.get('/', productController.renderHomePage);
router.get('/books/:id', productController.renderProductDetails);
router.get('/books', productController.renderSearchBookPage);
router.get('/register', authController.renderRegisterPage);
router.get('/confirm-email', authController.renderConfirmEmailPage);
router.get('/confirm-token/:token', authController.confirmToken);



router.use('/api/products', productApiRouter);

router.use('/api/categories', categoryApiRouter);
router.use('/api/auth', authApiRouter);




module.exports = router;