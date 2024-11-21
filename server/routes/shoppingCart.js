import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { vertifyToken } from '../middlewares/authMiddleware.js';
import { findProductById } from '../controllers/productControllers.js';
import { addProductToShoppingCart, getShoppingCart, removeItemCart } from '../controllers/shoppingCartController.js';

const router = express.Router();
router.get(API_PATH.GET_SHOPPINGCART,vertifyToken,getShoppingCart);
router.post(API_PATH.ADD_TO_SHOPPINGCART,vertifyToken,findProductById,addProductToShoppingCart);
router.delete(API_PATH.REMOVE_ITEM_CART, vertifyToken, removeItemCart);
export default router;