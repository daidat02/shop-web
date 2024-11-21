import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { registerAccount,loginUser, sendOTP, checkOTP, refressToken, logoutUser } from '../controllers/authControllers.js'; 

const router = express.Router(); 

router.post(API_PATH.SEND_OTP,sendOTP)
// router.post(API_PATH.CHECK_OTP, checkOTP)
router.post(API_PATH.REG_ACC,registerAccount); 
router.post(API_PATH.LOGIN,loginUser)
router.post(API_PATH.REFRESH_TOKEN, refressToken);
router.post(API_PATH.LOGOUT , logoutUser)
export default router; 
