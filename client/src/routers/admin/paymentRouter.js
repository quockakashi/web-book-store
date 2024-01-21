const router = require('express').Router();
const paymentController = require('../../controllers/admin/paymentController');
router.get('/', paymentController.renderPaymentPage);

router.get('/payments', paymentController.getAllPayment);

router.get('/main-wallet', paymentController.getMainWallet);

router.get('/overview', paymentController.getOverview);

module.exports = router;