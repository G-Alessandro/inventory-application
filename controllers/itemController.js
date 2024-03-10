const asyncHandler = require('express-async-handler');

const Item = require('../models/item');

exports.item_category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Item.find({}, 'category')
    .sort({ category: 1 })
    .exec();

  res.render('index', { title: 'Category List', item_category_list: allCategories });
});
