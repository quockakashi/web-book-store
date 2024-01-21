const router = require('express').Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.createNewTransaction);

router.post('/by-wallet', transactionController.getAllTransactionByWalletId);

router.post('/overview', transactionController.getTransactionsOverview);

module.exports = router;