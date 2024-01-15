const router = require('express').Router();
const productController = require('../../controllers/admin/productController');

router.get('/', productController.renderIndexPage);

router.get('/new-product', productController.renderAddingPage);

router.get('/edit/:id', productController.renderEditProductPage);

router.get('/:id', productController.renderDetailPage)


module.exports = router;