const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController')

router.post('/', controller.create);
router.delete('/:id', controller.delete);
router.put('/:id', controller.update);
router.get('/', controller.products);
router.get('/:id', controller.product);

module.exports = router;