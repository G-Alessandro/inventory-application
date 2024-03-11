const express = require('express');

const router = express.Router();

const item_controller = require('../controllers/categoryController');

router.get('/', item_controller.categories_list);

router.get('/all-categories', item_controller.all_items);

module.exports = router;
