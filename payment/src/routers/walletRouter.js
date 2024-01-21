const router = require('express').Router();
const walletController = require('../controllers/walletController');

router.post('/', walletController.createNewWallet);

router.post('/balance', walletController.getBalance);

module.exports = router;