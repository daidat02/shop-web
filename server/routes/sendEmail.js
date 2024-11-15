import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { sendInfoOrder } from '../controllers/sentEmailcontronler.js';
const router = express.Router();

router.post(API_PATH.SEND_INFO_ORDER,sendInfoOrder)

export default router;