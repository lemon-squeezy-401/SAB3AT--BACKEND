'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'junior';
const { serviceSchema } = require('../../models/service-schema');
const { productSchema } = require('../../models/product-schema');
const users = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'editor', 'admin'],
    },
    services: [serviceSchema],
    products: [productSchema],
    unConfermedReq: [],
    confirmedReq: [],
    rejectedReq: [],
  },
  {
    toJSON: { virtuals: true },
  },
);
// }, { toObject: { getters: true } }); // What would this do if we use this instead of just });

/**
  service: [{ type: mongoose.Schema.Types.ObjectId, ref: 'service' }],
*/
// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!

users.virtual('token').get(function () {
  let tokenObject = {
    email: this.email,
  };
  return jwt.sign(tokenObject, secret);
});

users.virtual('capabilities').get(function () {
  let acl = {
    user: ['read', 'create', 'update', 'delete'],
    editor: ['read', 'create', 'update', 'delete'],
    admin: ['read', 'create', 'update', 'delete'],
  };
  return acl[this.role];
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function (email, password) {
  const user = await this.findOne({ email });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error('Invalid User');
};

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, secret);
    const user = this.findOne({ email: parsedToken.email });
    if (user) {
      return user;
    }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
};

// this commint is to commit anything to the github
// anything for this comment
module.exports = mongoose.model('users', users);
