const router = require('express').Router();
const userController = require('../../controllers/admin/userController');

router.post('/update', userController.updateUser);

module.exports = router;