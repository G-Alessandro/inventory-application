const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  category: {
    type: String, minLength: 1, maxLength: 30, required: true,
  },
  name: {
    type: String, minLength: 1, maxLength: 100, required: true,
  },
  image: {
    name: { type: String },
    imageUrl: { type: String },
    publicId: { type: String },
  },
  author: {
    type: Schema.Types.Mixed, required: true,
  },
  genre: {
    type: Schema.Types.Mixed, required: true,
  },
  details: { type: String },
});

ItemSchema.virtual('url').get(function () {
  return `/index/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
