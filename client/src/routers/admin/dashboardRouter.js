const router = require('express').Router();
const dashboardController = require('../../controllers/admin/dashboardController');

router.get('/', dashboardController.renderDashboardPage);

module.exports = router;