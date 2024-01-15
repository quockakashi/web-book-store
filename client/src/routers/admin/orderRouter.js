const router = require('express').Router();
const orderController = require('../../controllers/admin/orderController');

router.get('/', orderController.renderOrderPage);

module.exports = router;