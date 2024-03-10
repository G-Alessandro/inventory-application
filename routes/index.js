const express = require('express');

const router = express.Router();

const item_controller = require('../controllers/itemController');

router.get('/', item_controller.item_category_list);

module.exports = router;
