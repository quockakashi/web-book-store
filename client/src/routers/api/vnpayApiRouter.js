const router = require('express').Router();
const vnpayController = require('../../controllers/vnpayController');
const { requireLogin } = require('../../middlewares/handleLoginUser')

router.get('/create-payment', vnpayController.createPayment);
router.get('/confirm-payment', vnpayController.confirmPayment);
router.get('/callback', vnpayController.handleDeposit);

module.exports = router;