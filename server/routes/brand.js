import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { createBrand, getBrand } from '../controllers/brand.js';

const router = express.Router(); // Khởi tạo router

router.get(API_PATH.GET_BRAND, getBrand)
router.post(API_PATH.CREATE_BRAND, createBrand)

export default router