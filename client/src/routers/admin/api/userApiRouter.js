const router = require('express').Router();
const userController = require('../../../controllers/admin/userController');

router.post('/:id', userController.editUser);

router.delete('/:id', userController.removeUser);

router.get('/self', userController.getPersonalInfo);

module.exports = router;