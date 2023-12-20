const router = require('express').Router();
const { isAdmin } = require('../middlewares/authorizeUser');
const userController = require('../controllers/userController');


// render user management page
router.get('/', userController.renderIndexPage);

// render user edit page
router.get('/edit/:id', userController.renderEditPage);

// render detail user page
router.get('/:id', userController.renderDetailPage);


module.exports = router;