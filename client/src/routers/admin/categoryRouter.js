const router = require('express').Router();
const categoryController = require('../../controllers/admin/categoryController');

router.get('/', categoryController.renderCategoriesPage);

router.get('/new-category', categoryController.renderAddingPage);

router.get('/edit/:id', categoryController.renderEditPage);

module.exports = router;