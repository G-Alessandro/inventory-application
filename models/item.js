const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  category: {
    type: String, minLength: 1, maxLength: 100, required: true,
  },
  name: {
    type: String, minLength: 1, maxLength: 100, required: true,
  },
  author: {
    type: Schema.Types.Mixed, minLength: 1, maxLength: 100, required: true,
  },
  genre: {
    type: Schema.Types.Mixed, minLength: 1, maxLength: 100, required: true,
  },
  details: { type: String, minLength: 1, maxLength: 5000 },
});

ItemSchema.virtual('url').get(function () {
  return `/index/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
