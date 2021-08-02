'use strict';

const mongoose = require('mongoose');
const { commentSchema } = require('./comment-schema');
const productSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  productProvider: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  likes: {
    type: Number,
  },
  comments: [commentSchema],
  ownerEmail: {
    type: String,
  },
  date: { type: Date, default: Date.now() },
});

const productModel = mongoose.model('product', productSchema);

module.exports = { productSchema, productModel };
