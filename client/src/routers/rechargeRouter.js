const router = require('express').Router();
const rechargeController = require('../controllers/rechargeController');

router.get('/', rechargeController.renderRechargePage);

module.exports = router;