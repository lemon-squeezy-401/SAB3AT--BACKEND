'use strict';

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    
  
  likerId: {
    type: String,
  },
  
  // date: { type: Date, default: Date.now() },
});



module.exports = { likeSchema };