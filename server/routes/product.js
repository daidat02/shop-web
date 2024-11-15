import express from 'express';
import { API_PATH } from '../configs/Constants.js';
import { createProduct, createTag, createVariant, deleteProduct, getProduct, getProductByCategory, getProductDetail, getTags, getVariants, removeProduct, updateProductToOrderSuccess } from '../controllers/productControllers.js';
import { findCategoryById } from '../controllers/categoryController.js';

const router = express.Router(); // Khởi tạo router


router.get(API_PATH.GET_PROD, getProduct);
router.get(API_PATH.GET_PROD_CAT_ID, getProductByCategory);
router.get(API_PATH.GET_PROD_DETAIL, getProductDetail)
router.get('/update/product/:orderId',updateProductToOrderSuccess)
router.post(API_PATH.CREATE_PROD,createProduct);
router.post(API_PATH.DELETE_PRODUCT,deleteProduct);
router.delete(API_PATH.REMOVE_PRODUCT,removeProduct);

router.get(API_PATH.GET_VARIANT,getVariants)
router.post(API_PATH.CREATE_VARIANT,createVariant);
router.get(API_PATH.GET_TAG,getTags);
router.post(API_PATH.CREATE_TAG,createTag);

export default router