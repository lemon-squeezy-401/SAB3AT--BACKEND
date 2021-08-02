'use strict';

const express = require('express');
const productRouter = express.Router();
const productsController=require('../controllers/products.controller');

productRouter.get('/products', productsController.getproducts);

productRouter.post('/products', productsController.addingProductsLikeAndcomment);

productRouter.put('/products/:id',productsController.editProductsComment);

productRouter.delete('/products/:id', productsController.deleteProductsComment);

module.exports = productRouter;
