const router = require('express').Router();
const reviewController = require('../../controllers/reviewController');

router.get('/by-user', reviewController.getReviewsByUser);

module.exports = router;