const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');

const getAllCategories = () => Item.distinct('category').sort({ category: 1 }).exec();

exports.item_details_get = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    getAllCategories(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('item_details', { categories_list: allCategories, item_details: itemDetails });
});

exports.add_item_get = asyncHandler(async (req, res, next) => {
  const allCategories = await getAllCategories();
  res.render('item_form', { categories_list: allCategories });
});

exports.add_item_post = [
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre', 'Genre must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('details', 'Details must not be empty.')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.render('addItem', { errors: errorMessages });
    } else {
      const item = new Item({
        category: req.body.category,
        name: req.body.name,
        author: req.body.author,
        genre: req.body.genre,
        details: req.body.details,
      });
      await item.save();
      res.redirect(`/category/${req.body.category}`);
    }
  }),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    getAllCategories(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('item_form', { categories_list: allCategories, item_details: itemDetails });
});

exports.item_update_post = [
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre', 'Genre must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('details', 'Details must not be empty.')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.render('addItem', { errors: errorMessages });
    } else {
      try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, {
          category: req.body.category,
          name: req.body.name,
          author: req.body.author,
          genre: req.body.genre,
          details: req.body.details,
        }, { new: true });

        res.redirect(`/category/item/${updatedItem._id}`);
      } catch (error) {
        next(error);
      }
    }
  }),
];

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.itemId).exec();
  if (!item) {
    return res.status(404).send('Item not found');
  }

  const { category } = item;

  await Item.findByIdAndDelete(req.params.itemId);

  const totalCategory = await Item.countDocuments({ category });

  if (totalCategory === 0) {
    const [allCategories, allItems] = await Promise.all([
      getAllCategories(),
      Item.find({}, 'category').populate('name').populate('author').populate('genre')
        .sort({ category: 1 })
        .exec(),
    ]);
    res.render('items_container', { categories_list: allCategories, all_items: allItems });
  } else {
    res.redirect(`/category/${category}`);
  }
});
