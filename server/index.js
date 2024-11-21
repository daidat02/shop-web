import express from 'express';
import http from 'http'; // Import http server
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import configureWebSocket from './webSocket/socketConfig.js';

// Database
import db from './configs/db/index.js'
//
import authRoute from './routes/auth.js'; 
import catRoute from './routes/category.js'
import uploadRoute from './routes/upload.js'
import productRoute from './routes/product.js'
import shoppingCartRoute from './routes/shoppingCart.js'
import orderRoute from './routes/order.js'
import brandRoute from './routes/brand.js'
import userRoute from   './routes/user.js'
import voucherRoute from './routes/voucher.js'
import paymentRoute from './routes/payment.js'
import sendEmailRoute from './routes/sendEmail.js'
import messageRoute from './routes/message.js'
const app = express();
// Tạo server HTTP
const server = http.createServer(app);
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
app.use(brandRoute)
app.use(userRoute)
app.use(voucherRoute)
app.use(paymentRoute)
app.use(sendEmailRoute)
app.use(messageRoute)


// // Cấu hình WebSocket
configureWebSocket(server)

// Khởi động server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
