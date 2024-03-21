const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const Item = require('../models/item');
const cloudinary = require('../cloudinary/cloudinaryConfiguration');
const upload = require('../multer/multer');
require('dotenv').config();

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
  upload.single('uploaded_image'),
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
        let uploadImage = {
          original_filename: '',
          secure_url: '',
          public_id: '',
        };

        if (req.file) {
          uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: 'inventoryApp' });
        } else {
          uploadImage = {
            original_filename: 'inventory-app-cover',
            secure_url: 'https://res.cloudinary.com/duov43vlh/image/upload/w_300,h_300/v1710789330/inventoryApp/y2j4xt2ujnrnnz8nuqmt.svg',
            public_id: 'inventoryApp/y2j4xt2ujnrnnz8nuqmt',
          };
        }

        const item = new Item({
          category: req.body.category,
          name: req.body.name,
          image: {
            name: uploadImage.original_filename,
            imageUrl: `${uploadImage.secure_url.replace('upload/', 'upload/w_300,h_300/')}`,
            publicId: uploadImage.public_id,
          },
          author: req.body.author,
          genre: req.body.genre,
          details: req.body.details,
        });

        await item.save();

        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error('Error while deleting the file:', err);
            } else {
              console.log('File deleted successfully');
            }
          });
        }

        res.redirect(`/category/${req.body.category}`);
      } catch (error) {
        console.error('An error occurred while processing the request:', error);
        res.status(500).send('An error occurred while processing the request.');
      }
    }
  }),
];

exports.password_form_get = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    getAllCategories(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('password_form', { categories_list: allCategories, item_details: itemDetails, action: 'authentication' });
});

exports.password_form_post = asyncHandler(async (req, res, next) => {
  const passwordEntered = req.body.password;
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (passwordEntered === correctPassword) {
    res.redirect(`/category/editItem/${req.params.itemId}`);
  } else {
    res.status(401).send('Wrong password. Access denied.');
  }
});

exports.item_edit_get = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    getAllCategories(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('item_form', { categories_list: allCategories, item_details: itemDetails });
});

exports.item_edit_post = [
  upload.single('uploaded_image'),
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
        const currentItem = await Item.findById(req.params.itemId);

        let uploadImage = {
          original_filename: currentItem.image.name,
          secure_url: currentItem.image.imageUrl,
          public_id: currentItem.image.publicId,
        };

        if (req.file) {
          if (currentItem.image.publicId === 'inventoryApp/y2j4xt2ujnrnnz8nuqmt') {
            uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: 'inventoryApp' });
          } else {
            uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: 'inventoryApp' });
            await cloudinary.uploader.destroy(currentItem.image.publicId);
          }
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, {
          category: req.body.category,
          name: req.body.name,
          image: {
            name: uploadImage.original_filename,
            imageUrl: `${uploadImage.secure_url.replace('upload/', 'upload/w_300,h_300/')}`,
            publicId: uploadImage.public_id,
          },
          author: req.body.author,
          genre: req.body.genre,
          details: req.body.details,
        }, { new: true });

        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error('Error while deleting the file:', err);
            } else {
              console.log('File deleted successfully');
            }
          });
        }

        res.redirect(`/category/item/${updatedItem._id}`);
      } catch (error) {
        next(error);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const [allCategories, itemDetails] = await Promise.all([
    getAllCategories(),
    Item.findOne({ _id: req.params.itemId }).exec(),
  ]);
  res.render('password_form', { categories_list: allCategories, item_details: itemDetails, action: 'deleteItem' });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const passwordEntered = req.body.password;
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (passwordEntered === correctPassword) {
    const item = await Item.findById(req.params.itemId).exec();
    if (!item) {
      return res.status(404).send('Item not found');
    }
    const { category } = item;

    if (item.image.publicId !== 'inventoryApp/y2j4xt2ujnrnnz8nuqmt') {
      await cloudinary.uploader.destroy(item.image.publicId);
      console.log('Image removed');
    }
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
  } else {
    res.status(401).send('Wrong password. Access denied.');
  }
});
