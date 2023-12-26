const router = require('express').Router();
const productController = require('../../controllers/productController');

router.get('/new-books', productController.getNewBooks);
router.get('/top-rating', productController.getTopRating);
router.get('/best-seller', productController.getBestSeller);
router.get('/for-kids', productController.getKidBooks);
router.get('/book-same-categories/:id', productController.getBookSameCategories);
router.get('/', productController.getBooks);

module.exports = router;