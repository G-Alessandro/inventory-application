const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');

exports.add_item_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Item.distinct('category')
    .sort({ category: 1 })
    .exec();
  res.render('add_item_form', { categories_list: allCategories });
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
