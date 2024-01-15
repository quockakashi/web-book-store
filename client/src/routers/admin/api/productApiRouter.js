const router = require('express').Router();
const productController = require('../../../controllers/admin/productController');

router.post('/', productController.addProduct);

router.post('/:id', productController.editProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;