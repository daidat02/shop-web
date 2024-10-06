import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Database
import db from './configs/db/index.js'

import authRoute from './routes/auth.js'; // Thêm đuôi `.js`
import catRoute from './routes/category.js'
import uploadRoute from './routes/upload.js'
import productRoute from './routes/product.js'
import shoppingCartRoute from './routes/shoppingCart.js'
import orderRoute from './routes/order.js'
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Kết nối database
db.connect();

// Routes
app.use(bodyParser.json());
app.use(authRoute);
app.use(catRoute);
app.use(uploadRoute);
app.use(productRoute)
app.use(shoppingCartRoute);
app.use(orderRoute)
// Khởi động server

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
