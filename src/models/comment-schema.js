'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  commenterId: {
    type: String,
  },
  date: { type: Date, default: Date.now() },
});



module.exports = { commentSchema };