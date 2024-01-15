const router = require('express').Router();
const reviewController = require('../../../controllers/admin/reviewController');

router.get('/by-user', reviewController.getReviewsByUser);

module.exports = router;