import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { generateNewPassword, resetPassword, sendInfoOrder } from '../controllers/sentEmailcontronler.js';
const router = express.Router();

router.post(API_PATH.SEND_INFO_ORDER,sendInfoOrder)
router.post (API_PATH.RESET_PASS, resetPassword)
router.get(API_PATH.RETURN_NEWPASS, generateNewPassword)
export default router;