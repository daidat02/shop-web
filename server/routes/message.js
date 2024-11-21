import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { getMessages } from '../controllers/socketController.js';
const router = express.Router(); // Khởi tạo router

router.get(API_PATH.GET_MESSAGE, getMessages)

export default router