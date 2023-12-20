const router = require('express').Router();
const userController = require('../../controllers/userController');

router.post('/:id', userController.editUser);

router.delete('/:id', userController.removeUser);

router.get('/self', userController.getPersonalInfo);

module.exports = router;