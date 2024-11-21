import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { vnpayReturn } from '../../../api/API_Payment';
import { sendInfoOrder } from '../../../api/API_SendEmail';
import { useSelector } from 'react-redux';

// Constants
const PAYMENT_STATUS = {
    SUCCESS: 'success',
    FAILED: 'failed',
    ERROR: 'error'
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const VNPayReturn = () => {
    const initialAccount = useSelector((state)=> state.auth?.account)
    const user = initialAccount?.user

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionInfo, setTransactionInfo] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyPayment = async () => {
            if (!location.search) {
                message.error("Không có thông tin thanh toán!");
                setPaymentStatus(PAYMENT_STATUS.ERROR);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Thêm timeout cho request
                const timeoutId = setTimeout(() => {
                    message.error("Yêu cầu xử lý quá thời gian!");
                    setPaymentStatus(PAYMENT_STATUS.ERROR);
                    setLoading(false);
                }, 30000); // 30 giây timeout

                const response = await vnpayReturn(location.search);
                clearTimeout(timeoutId);

                if (response.success) {
                    setPaymentStatus(PAYMENT_STATUS.SUCCESS);
                    setTransactionInfo(response.data);
                    await sendInfoOrder(user?.email,response.orderId);

                    message.success("Thanh toán thành công!");
                } else {
                    setPaymentStatus(PAYMENT_STATUS.FAILED);
                    message.error(response.message || "Thanh toán thất bại!");
                }
            } catch (error) {
                console.error("Lỗi xử lý thanh toán:", error);
                message.error(error.response?.message || "Lỗi khi xử lý kết quả thanh toán!");
                setPaymentStatus(PAYMENT_STATUS.ERROR);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [location.search]);

    // Loading component
    if (loading) {
        return (
            <div className="payment-loading-container">
                <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
            </div>
        );
    }

    // Result components
    const resultProps = {
        [PAYMENT_STATUS.SUCCESS]: {
            status: "success",
            title: "Thanh toán thành công!",
            subTitle: (
                <div className='transaction-container'>
                    <div className="transaction-info">
                      <p>Mã đơn hàng: {transactionInfo.orderId}</p>
                      <p>Số tiền: {formatCurrency(transactionInfo.amount)}</p>
                      <p>Mã giao dịch: {transactionInfo.transactionNo}</p>
                      <p>Ngân hàng: {transactionInfo.bankCode}</p>
                  </div>
                </div>
            ),
            extra: [
                <Button 
                    type="primary" 
                    key="home" 
                    onClick={() => navigate('/')}
                >
                    Quay về Trang Chủ
                </Button>,
                <Button 
                    key="orders" 
                    onClick={() => navigate('/me/order-detail/:orderId')}
                >
                    Xem Đơn Hàng
                </Button>,
                <Button 
                    key="buy" 
                    onClick={() => navigate('/product')}
                >
                    Tiếp tục mua sắm
                </Button>
            ]
        },
        [PAYMENT_STATUS.FAILED]: {
            status: "error",
            title: "Thanh toán thất bại!",
            subTitle: "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.",
            extra: [
                <Button 
                    type="primary" 
                    key="tryAgain" 
                    onClick={() => navigate('/checkout')}
                >
                    Thử Lại
                </Button>,
                <Button 
                    key="home" 
                    onClick={() => navigate('/')}
                >
                    Quay về Trang Chủ
                </Button>
            ]
        },
        [PAYMENT_STATUS.ERROR]: {
            status: "warning",
            title: "Lỗi xử lý thanh toán",
            subTitle: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.",
            extra: [
                <Button 
                    type="primary" 
                    key="support" 
                    onClick={() => navigate('/support')}
                >
                    Liên Hệ Hỗ Trợ
                </Button>,
                <Button 
                    key="home" 
                    onClick={() => navigate('/')}
                >
                    Quay về Trang Chủ
                </Button>
            ]
        }
    };

    return (
        <div className="checkout-content-status">
            <Result {...resultProps[paymentStatus]} />
        </div>
    );
};

// Styles
const styles = `
.payment-loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.checkout-content-status {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
}

.transaction-container{
  display:flex;
  justify-content:center;
}
.transaction-info {
    text-align: left;
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
}

.transaction-info p {
    margin: 8px 0;
    font-size: 16px;
}
`;

// Thêm styles vào document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default VNPayReturn;