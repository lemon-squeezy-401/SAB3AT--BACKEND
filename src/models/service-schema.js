'use strict';

const mongoose = require('mongoose');
const { commentSchema } = require('./comment-schema');
const { likeSchema } = require('./like-schema');

const serviceSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  serviceProvider: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  likes:[likeSchema],
  comments: [commentSchema],
  ownerEmail: {
    type: String,
  },
  date: { type: Date, default: Date.now() },
});

const serviceModel = mongoose.model('service', serviceSchema);

module.exports = { serviceSchema, serviceModel };
