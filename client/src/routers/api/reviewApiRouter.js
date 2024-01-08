const router = require('express').Router();
const reviewController = require('../../controllers/reviewController');
const {requireLogin} = require('../../middlewares/handleLoginUser')

router.post('/', requireLogin, reviewController.postReview);
router.get('/product/:id', reviewController.getAllReviewsByProductId);
router.get('/by-user', reviewController.getReviewsByUser);

module.exports = router;