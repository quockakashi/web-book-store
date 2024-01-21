const router = require('express').Router();
const orderController = require('../../controllers/orderController');


router.get('/by-user', orderController.getOrdersByUser);

router.post('/', orderController.createNewOrder);

module.exports = router;