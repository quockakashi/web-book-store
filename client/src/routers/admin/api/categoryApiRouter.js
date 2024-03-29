const router = require('express').Router();
const categoryController = require('../../../controllers/admin/categoryController');

router.post('/', categoryController.addCategory);

router.post('/:id', categoryController.editCategory);

router.delete('/:id', categoryController.removeCategory)


module.exports = router;