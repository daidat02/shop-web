import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { addVoucher, getVoucher } from '../controllers/voucherControllers.js';

const router = express.Router();

router.get(API_PATH.GET_VOUCHER,getVoucher);
router.post(API_PATH.ADD_VOUCHER, addVoucher);

export default router;