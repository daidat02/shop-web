import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { vertifyToken } from '../middlewares/authMiddleware.js';
import { addShippingAddress, getCustomers, getShippingAddress } from '../controllers/userController.js';

const router = express.Router();

router.post(API_PATH.ADD_ADDRESS, vertifyToken, addShippingAddress)
router.get(API_PATH.GET_ADDRESS, vertifyToken, getShippingAddress)
router.get(API_PATH.GET_CUSTOMERS,getCustomers)
export default router;