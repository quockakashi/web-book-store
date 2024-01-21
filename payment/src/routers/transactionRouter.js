const router = require('express').Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.createNewTransaction);

router.post('/by-wallet', transactionController.getAllTransactionByWalletId);

router.post('/overview', transactionController.getTransactionsOverview);

router.post('/payments', transactionController.getAllPayment);

router.post('/overview-main-wallet', transactionController.getOverviewDepositAndPayment);

module.exports = router;