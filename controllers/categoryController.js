const asyncHandler = require('express-async-handler');

const Item = require('../models/item');

exports.categories_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Item.distinct('category')
    .sort({ category: 1 })
    .exec();
  console.log('allCategories', allCategories);
  res.render('layout', { categories_list: allCategories });
});

exports.all_items = asyncHandler(async (req, res, next) => {
  const allCategories = await Item.distinct('category')
    .sort({ category: 1 })
    .exec();
  const allItems = await Item.find({}, 'category').exec();
  console.log('allItems', allItems);
  res.render('items_container', { all_items: allItems, categories_list: allCategories });
});
