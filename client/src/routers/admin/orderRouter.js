const router = require('express').Router();
const orderController = require('../../controllers/admin/orderController');

router.get('/', orderController.renderOrderPage);

router.get('/:id', orderController.getOrderById)

module.exports = router;