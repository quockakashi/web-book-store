const router = require('express').Router();
const { isAdmin } = require('../middlewares/authorizeUser');
const userController = require('../controllers/userController');


// render user management page
router.get('/', userController.renderIndexPage);

// render user edit page
router.get('/edit/:id', userController.renderEditPage);


module.exports = router;