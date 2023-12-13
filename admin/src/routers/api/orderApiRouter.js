const router = require('express').Router();
const orderController = require('../../controllers/orderController');

router.post('/:id', orderController.updateStatus);

router.get('/yearly-revenue', orderController.getYearlyRevenue);

router.get('/top-revenue', orderController.getTopRevenue);

module.exports = router;