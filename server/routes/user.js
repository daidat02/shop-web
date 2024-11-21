import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { vertifyToken } from '../middlewares/authMiddleware.js';
import { addShippingAddress, getCustomers, getProfileUser, getShippingAddress, updateDefaultAdress } from '../controllers/userController.js';

const router = express.Router();

router.post(API_PATH.ADD_ADDRESS, vertifyToken, addShippingAddress)
router.get(API_PATH.GET_ADDRESS, vertifyToken, getShippingAddress)
router.get(API_PATH.GET_CUSTOMERS,vertifyToken,getCustomers)
router.get(API_PATH.GET_PROFILE_USER,vertifyToken, getProfileUser)
router.get(API_PATH.UPDATE_ADDRESS_DEFAULT,  updateDefaultAdress)

export default router;