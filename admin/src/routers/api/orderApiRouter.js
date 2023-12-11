const router = require('express').Router();
const orderController = require('../../controllers/orderController');

router.post('/:id', orderController.updateStatus);

module.exports = router;