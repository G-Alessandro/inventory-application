const express = require('express');

const router = express.Router();

const item_controller = require('../controllers/categoryController');
const add_item_controller = require('../controllers/itemController');

router.get('/', item_controller.categories_list_get);

router.get('/all-categories', item_controller.all_items_get);

router.get('/category/:categoryName', item_controller.category_items_get);

router.get('/category/item/:itemId', item_controller.item_details_get);

router.get('/addItem', add_item_controller.add_item_get);

router.post('/addItem', add_item_controller.add_item_post);

module.exports = router;
