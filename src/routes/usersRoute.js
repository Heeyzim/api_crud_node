const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController')
router.post('/', controller.create);

router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.users);
router.get('/:id', controller.user);
module.exports = router;