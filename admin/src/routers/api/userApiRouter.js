const router = require('express').Router();
const userController = require('../../controllers/userController');

router.post('/:id', userController.editUser);

router.delete('/:id', userController.removeUser);

module.exports = router;