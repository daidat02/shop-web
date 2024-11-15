import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { vertifyToken } from '../middlewares/authMiddleware.js';
import { createOrder, customerCancelOrder, getMyOrders, getOrderById, getOrders, updateStatusOrder } from '../controllers/orderController.js';
import { checkOTP } from '../controllers/authControllers.js';

const router = express.Router();

router.get(API_PATH.GET_ORDERS, getOrders)
router.get(API_PATH.GET_MY_ORDERS,vertifyToken, getMyOrders)
router.get(API_PATH.GET_ORDER_BY_ID,getOrderById);
router.post(API_PATH.CREATE_ORDER,vertifyToken,checkOTP,createOrder);
router.post(API_PATH.UPDATE_STATUS_ORDER, updateStatusOrder);
router.post(API_PATH.CANCEL_ORDER,vertifyToken, customerCancelOrder);

export default router