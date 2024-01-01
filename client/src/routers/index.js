const router = require('express').Router();
const productController = require('../controllers/productController');


const productApiRouter = require('./api/productApiRouter');
const categoryApiRouter = require('./api/categoryApiRouter');


router.get('/', productController.renderHomePage);
router.get('/books/:id', productController.renderProductDetails);
router.get('/books', productController.renderSearchBookPage);



router.use('/api/products', productApiRouter);

router.use('/api/categories', categoryApiRouter);




module.exports = router;