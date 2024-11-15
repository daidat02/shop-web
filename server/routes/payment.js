import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { createPaymentUrlVNP, VNPayReturn } from '../controllers/paymentContronler.js';
const router = express.Router();

router.get('/create_payment_url', createPaymentUrlVNP);
router.get('/vnpay_return', VNPayReturn);

export default router