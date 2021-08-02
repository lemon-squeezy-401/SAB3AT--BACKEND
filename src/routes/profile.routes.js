'use strict';

const express = require('express');
const profileRouter = express.Router();
const profileController=require('../controllers/profile.controller');
// use /profile to reset the password => strech goal
profileRouter.post('/profile-service/:id', profileController.profileAdding);

profileRouter.post('/profile-product/:id', profileController.addProdutcToUser);

profileRouter.get('/profile/:id', profileController.getProfileInfo);

profileRouter.put('/profile/:id', profileController.editProfileInfo);

profileRouter.delete('/profile/:id', profileController.deleteProfileInfo);

module.exports = profileRouter;
