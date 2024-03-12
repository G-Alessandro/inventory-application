const asyncHandler = require('express-async-handler');

const Item = require('../models/item');

exports.categories_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Item.distinct('category')
    .sort({ category: 1 })
    .exec();
  res.render('layout', { categories_list: allCategories });
});

exports.all_items = asyncHandler(async (req, res, next) => {
  const [allCategories, allItems] = await Promise.all([
    Item.distinct('category').sort({ category: 1 }).exec(),
    Item.find({}, 'category').populate('name').populate('author').populate('genre')
      .sort({ category: 1 })
      .exec(),
  ]);
  res.render('items_container', { categories_list: allCategories, all_items: allItems });
});

exports.category_items = asyncHandler(async (req, res, next) => {
  const [allCategories, categoryItems] = await Promise.all([
    Item.distinct('category').sort({ category: 1 }).exec(),
    Item.find({ category: req.params.categoryName }).exec(),
  ]);
  res.render('items_container', { categories_list: allCategories, all_items: categoryItems });
});

exports.item_details = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    Item.distinct('category').sort({ category: 1 }).exec(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('item_details', { categories_list: allCategories, item_details: itemDetails });
});
