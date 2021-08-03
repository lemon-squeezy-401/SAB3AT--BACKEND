'use strict';

const express = require('express');
const panelRoutes = express.Router();
// const permissions = require('../auth/middleware/acl');
// const bearerAuth = require('../auth/middleware/bearer');
const controlpanel=require('../controllers/controlPanel.controller');

panelRoutes.get('/controlpanel/:id', controlpanel.getUsers);

panelRoutes.post('/controlpanel/:id', controlpanel.addAcount);

panelRoutes.put('/controlpanel/:id',controlpanel.editUserInfo);

panelRoutes.delete('/controlpanel/:id', controlpanel.deleteUser);

module.exports = panelRoutes;
