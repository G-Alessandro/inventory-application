const mongoose = require('mogoose');

const {Schema} = mongoose 

const CategorySchema = new Schema {(
  name: { type: String, minLength: 1, maxLength: 100, required: true },
)}

CategorySchema.virtual('url').get(function () {
  return `/catalog/category/${this._id}`;
});
