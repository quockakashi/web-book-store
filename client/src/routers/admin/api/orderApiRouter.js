const router = require('express').Router();
const orderController = require('../../../controllers/admin/orderController');

router.post('/:id', orderController.updateStatus);

router.get('/yearly-revenue', orderController.getYearlyRevenue);

router.get('/top-revenue', orderController.getTopRevenue);

router.get('/by-user', orderController.getOrdersByUser);

module.exports = router;