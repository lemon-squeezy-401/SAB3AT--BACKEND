'use strict';

const express = require('express');
const serviceRoutes = express.Router();
const serviceController=require('../controllers/service.controller');

serviceRoutes.get('/service', serviceController.getServices);

serviceRoutes.post('/service', serviceController.addingLikeAndcomment);

serviceRoutes.put('/service/:id',serviceController.editComment);

serviceRoutes.delete('/service/:id', serviceController.deleteComment);

module.exports = serviceRoutes;
