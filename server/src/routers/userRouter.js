const router = require('express').Router();
const userModel = require('../models/userModel');
const { isAdmin } = require('../middlewares/authorizeUser');
const userController = require('../controllers/userController');

// delete an account
router.delete('/', isAdmin, userController.removeUser);


module.exports = router;