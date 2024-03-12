const express = require('express');

const router = express.Router();

const item_controller = require('../controllers/categoryController');

router.get('/', item_controller.categories_list);

router.get('/all-categories', item_controller.all_items);

router.get('/category/:categoryName', item_controller.category_items);

router.get('/category/item/:itemId', item_controller.item_details);

module.exports = router;
