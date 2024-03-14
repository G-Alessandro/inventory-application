const express = require('express');

const router = express.Router();

const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

router.get('/', category_controller.categories_list_get);

router.get('/all-categories', category_controller.all_items_get);

router.get('/category/:categoryName', category_controller.category_items_get);

router.get('/category/item/:itemId', item_controller.item_details_get);

router.get('/addItem', item_controller.add_item_get);

router.post('/addItem', item_controller.add_item_post);

router.get('/category/updateItem/:itemId', item_controller.item_update_get);

router.post('/category/updateItem/:itemId', item_controller.item_update_post);

router.post('/category/deleteItem/:itemId', item_controller.item_delete_post);

module.exports = router;
