const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.renderDashboardPage);

module.exports = router;