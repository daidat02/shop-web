import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { registerAccount,loginUser, sendOTP, checkOTP } from '../controllers/authControllers.js'; 

const router = express.Router(); 

router.post(API_PATH.SEND_OTP,sendOTP)
// router.post(API_PATH.CHECK_OTP, checkOTP)
router.post(API_PATH.REG_ACC,checkOTP,registerAccount); 
router.post(API_PATH.LOGIN,loginUser)

export default router; 
