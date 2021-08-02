'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../auth/models/users');
const basicAuth = require('../auth/middleware/basic');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const users = await User.find({});
    const list = users.map(user => user);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;