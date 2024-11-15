import crypto from 'crypto';
import querystring from 'qs';
import dotenv from 'dotenv';
import { STATUS } from '../configs/Constants.js';
import DB_Connection from '../model/DBConnection.js';

dotenv.config();

/**
 * Cấu hình VNPay
 */
const CONFIG = {
    tmnCode: process.env.VNP_TMNCODE,
    hashSecret: process.env.VNP_HASHSECRET_KEY,
    url: process.env.VNP_URL,
    returnUrl: process.env.VNP_RETURN_URL,
};

/**
 * Tạo số ngẫu nhiên với độ dài xác định
 */
function generateRandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length));
}

/**
 * Format ngày giờ theo định dạng yyyyMMddHHmmss
 */
function formatDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Sắp xếp object theo key
 */
function sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

/**
 * Tạo URL thanh toán VNPay
 */
const createPaymentUrlVNP = async (req, res) => {
    const { orderId } = req.query;

    try {
        // Lấy thông tin đơn hàng
        const order = await DB_Connection.Order.findOne({ order_id: orderId }).populate('user');
        
        if (!order) {
            return res.status(STATUS.NOT_FOUND).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Tạo tham số thanh toán
        const dateFormat = formatDateTime();
        const tmnCode = CONFIG.tmnCode;
        const secretKey = CONFIG.hashSecret;
        const amount = Math.round(order.finalAmount * 100);
        const orderInfo = `Thanh toan don hang ${orderId}`;
        const returnUrl = CONFIG.returnUrl;
        const orderType = 'other';
        const txnRef = `${orderId}-${generateRandomNumber(4)}`; // Thêm số ngẫu nhiên để tránh trùng lặp
        
        let vnpUrl = CONFIG.url;
        const vnpParams = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': txnRef,
            'vnp_OrderInfo': orderInfo,
            'vnp_OrderType': orderType,
            'vnp_Amount': amount,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': req.ip || '127.0.0.1',
            'vnp_CreateDate': dateFormat
        };

        // Sắp xếp các tham số theo thứ tự a-z
        const sortedVnpParams = sortObject(vnpParams);
        
        // Tạo chuỗi ký tự cần ký
        const signData = querystring.stringify(sortedVnpParams, { encode: false });
        
        // Tạo chữ ký
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
        
        // Thêm chữ ký vào URL
        vnpUrl += '?' + querystring.stringify(sortedVnpParams, { encode: false });
        vnpUrl += '&vnp_SecureHash=' + signed;

        // Lưu thông tin thanh toán vào database nếu cần
        // await DB_Connection.Order.findOneAndUpdate(
        //     { order_id: orderId },
        //     { 
        //         payment_ref: txnRef,
        //         payment_url: vnpUrl,
        //         updated_at: new Date()
        //     }
        // );

        return res.status(STATUS.OK).json({
            success: true,
            paymentUrl: vnpUrl
        });

    } catch (error) {
        console.error('Lỗi khi tạo URL thanh toán:', error);
        return res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xử lý thanh toán',
            error: error.message
        });
    }
};

/**
 * Xử lý kết quả trả về từ VNPay
 */

const VNPayReturn = async (req, res) => {
    try {
        const vnpParams = req.query;
        const secureHash = vnpParams['vnp_SecureHash'];
        
        // Xóa chữ ký khỏi danh sách tham số
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        // Sắp xếp lại các tham số
        const sortedVnpParams = sortObject(vnpParams);
        
        // Tạo chuỗi ký tự để kiểm tra
        const signData = querystring.stringify(sortedVnpParams, { encode: false });
        
        // Tạo chữ ký để so sánh
        const hmac = crypto.createHmac("sha512", CONFIG.hashSecret);
        const checkSum = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        
        // Kiểm tra chữ ký
        if (secureHash === checkSum) {
            const responseCode = vnpParams['vnp_ResponseCode'];
            const txnRef = vnpParams['vnp_TxnRef'];
            const orderId = txnRef.split('-')[0]; // Lấy lại orderId từ txnRef

            // Kiểm tra kết quả giao dịch
            if (responseCode === '00') {
                // Cập nhật trạng thái đơn hàng
                const order = await DB_Connection.Order.findOneAndUpdate(
                    { order_id: orderId },
                    {
                        payment_status: 'paid',
                        payment_time: new Date(),
                        updated_at: new Date()
                    }
                );
                console.log(order);
                return res.status(STATUS.OK).json({
                    success: true,
                    message: 'Thanh toán thành công',
                    data: {
                        orderId,
                        amount: vnpParams['vnp_Amount'] / 100,
                        transactionNo: vnpParams['vnp_TransactionNo'],
                        bankCode: vnpParams['vnp_BankCode']
                    }
                });
            } else {
                // Cập nhật trạng thái thất bại
               const order= await DB_Connection.Order.findOneAndUpdate(
                    { order_id: orderId },
                    {
                        payment_status: 'failed',
                        updated_at: new Date()
                    }
                );
                console.log(order);
                return res.status(STATUS.OK).json({
                    success: false,
                    message: 'Thanh toán thất bại',
                    data: {
                        orderId,
                        responseCode
                    }
                });
            }
        } else {
            return res.status(STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Chữ ký không hợp lệ'
            });
        }

    } catch (error) {
        console.error('Lỗi khi xử lý kết quả thanh toán:', error);
        return res.status(STATUS.SERVER_ERROR).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xử lý kết quả thanh toán',
            error: error.message
        });
    }
};

export {
    createPaymentUrlVNP,
    VNPayReturn
};