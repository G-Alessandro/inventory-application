const asyncHandler = require('express-async-handler');

const Item = require('../models/item');

const getAllCategories = () => Item.distinct('category').sort({ category: 1 }).exec();

exports.all_items_get = asyncHandler(async (req, res, next) => {
  const [allCategories, allItems] = await Promise.all([
    getAllCategories(),
    Item.find({}, 'category').populate('image').populate('name').populate('genre')
      .sort({ category: 1 })
      .exec(),
  ]);
  res.render('items_container', { categories_list: allCategories, all_items: allItems });
});

exports.category_items_get = asyncHandler(async (req, res, next) => {
  const [allCategories, categoryItems] = await Promise.all([
    getAllCategories(),
    Item.find({ category: req.params.categoryName }).exec(),
  ]);
  res.render('items_container', { categories_list: allCategories, all_items: categoryItems });
});
