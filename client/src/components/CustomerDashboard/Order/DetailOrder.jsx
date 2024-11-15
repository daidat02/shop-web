import React from 'react';
import './homepage.css'
import { Flex } from 'antd';
const DetailOrder = () => {
    const order={
        "_id": "672db16d5968d31bd730f12a",
        "order_id": "595054",
        "user": {
            "isAccount": true,
            "_id": "672db1555968d31bd730f0ad",
            "user_name": "Nguyen Dai Dat",
            "email": "daidat01@gmail.com",
            "role": "customer",
            "id": "3b5854d1-ce69-4965-b14a-616e177c8410",
            "phonenumber": "1234456778",
            "order_quantity": 59,
            "total_spent": 4072525,
            "isAcount": true,
            "__v": 0,
            "last_order": "2024-11-10T07:35:31.287Z"
        },
        "items": [
            {
                "product": {
                    "_id": "671a6d523590fab53507f4f3",
                    "product_id": "5efa28c8-7064-46f1-bd40-a01df0f8890c",
                    "product_name": "Sample Product",
                    "description": "This is a sample product description.",
                    "brand": "64f9d80c2f9876ab12345678",
                    "price": 100,
                    "quantity": 20,
                    "productType": "Electronics",
                    "images": [
                        {
                            "url": "https://res.cloudinary.com/dqzzuzfd6/image/upload/v1728542895/wlasvzt0ri5iupwuv6wo.png",
                            "_id": "671a6d523590fab53507f4f4"
                        }
                    ],
                    "tags": [
                        {
                            "tag": "671a6bdc016334f02e35930b",
                            "_id": "671a6d523590fab53507f4f5"
                        },
                        {
                            "tag": "671a6c00016334f02e35931d",
                            "_id": "671a6d523590fab53507f4f6"
                        },
                        {
                            "tag": "671a6c06016334f02e35931f",
                            "_id": "671a6d523590fab53507f4f7"
                        }
                    ],
                    "category": "67076227ee2f6fc0392c37b0",
                    "createdAt": "2024-10-24T15:52:50.982Z",
                    "updatedAt": "2024-11-01T04:31:56.958Z",
                    "__v": 0,
                    "state": "active"
                },
                "quantity": 1,
                "priceTotal": 100,
                "_id": "672db16d5968d31bd730f12b"
            },
            {
                "product": {
                    "_id": "671a6d523590fab53507f4f3",
                    "product_id": "5efa28c8-7064-46f1-bd40-a01df0f8890c",
                    "product_name": "Sample Product",
                    "description": "This is a sample product description.",
                    "brand": "64f9d80c2f9876ab12345678",
                    "price": 100,
                    "quantity": 20,
                    "productType": "Electronics",
                    "images": [
                        {
                            "url": "https://res.cloudinary.com/dqzzuzfd6/image/upload/v1728542895/wlasvzt0ri5iupwuv6wo.png",
                            "_id": "671a6d523590fab53507f4f4"
                        }
                    ],
                    "tags": [
                        {
                            "tag": "671a6bdc016334f02e35930b",
                            "_id": "671a6d523590fab53507f4f5"
                        },
                        {
                            "tag": "671a6c00016334f02e35931d",
                            "_id": "671a6d523590fab53507f4f6"
                        },
                        {
                            "tag": "671a6c06016334f02e35931f",
                            "_id": "671a6d523590fab53507f4f7"
                        }
                    ],
                    "category": "67076227ee2f6fc0392c37b0",
                    "createdAt": "2024-10-24T15:52:50.982Z",
                    "updatedAt": "2024-11-01T04:31:56.958Z",
                    "__v": 0,
                    "state": "active"
                },
                "quantity": 1,
                "priceTotal": 100,
                "_id": "672db16d5968d31bd730f12b"
            }
            
        ],
        "totalBill": 100,
        "discountAmount": 15,
        "finalAmount": 115,
        "shippingCost": 30,
        "status": "completed",
        "payment_method": "cash_on_delivery",
        "payment_status": "paid",
        "shippingAddress": {
            "_id": "672dc29cdb35e61c0620fe07",
            "user": "672db1555968d31bd730f0ad",
            "recipient_name": "Đại Đạt",
            "province": "Thành phố Hồ Chí Minh",
            "district": "Quận Gò Vấp",
            "ward": "Phường 9",
            "street": "100/25 Đường Số 3",
            "type": "Nhà Riêng",
            "__v": 0
        },
        "createdAt": "2024-11-08T06:36:29.380Z",
        "updatedAt": "2024-11-08T17:45:40.029Z",
        "__v": 0,
        "payment_time": "2024-11-10T07:53:55.010Z"
    }

    const formattedDateTime = order.createdAt.toLocaleString('vi-VN', { hour12: false });

    return (
        <div className="content">
            {/* <div class="email-container">
                    <div class="email-body">
                        <div className='email-title'>
                            <p className='user-name'>Xin chào ${order.user.user_name},</p>
                            <div className='thanks-detail'>
                                <p>Cảm ơn bạn đã sử dụng dịch vụ của Chúng tôi!</p>
                                <p>Xác nhận bạn đơn hàng của bạn đã đặt thành công lúc {formattedDateTime}. </p>
                                <p>Chi tiết đơn hàng của bạn như sau:</p>
                            </div>
                        </div>
                        <div class="email-content-container ">
                            <div className='order-info card-content'>
                                <h5>Chi tiết đơn hàng</h5>
                                <div className='list-items' style={{borderBottom:'solid 0.5px #ccc'}}>
                                    <span>Tên Sản phẩm</span>
                                    <span>Số lượng</span>
                                    <span>Giá tiền</span>
                                </div>
                                {order.items.map((item)=>(
                                   <div className='items-container'>
                                        <div className='list-items'>
                                            <span className='product-name'>{item.product.product_name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>{item.product.price}</span>
                                        </div>
                                   </div>
                                ))}

                               <div className='order-price-container'>
                                    <div className='infor-row'>
                                            <span >Tổng tiền:</span> 
                                            <span>{order.totalBill}</span>
                                    </div>
                                    <div className='infor-row'>
                                        <span >Phí vận chuyển:</span> 
                                        <span>{order.shippingCost}</span>
                                    </div>
                                    <div className='infor-row'>
                                        <span >Giảm giá:</span> 
                                        <span>{order.discountAmount}</span>
                                    </div>
                                    <div className='infor-row'>
                                        <span >Tổng hóa đơn:</span> 
                                        <span>{order.finalAmount}</span>
                                    </div>
                               </div>
                            </div>  

                            <div className='order-user-info card-content'>
                                <h5>Thông tin người đặt:</h5>

                                <div className='infor-row'> 
                                    <span >Họ tên:</span> 
                                    <span>{order.user.user_name}</span>
                                </div>
                                <div className='infor-row'> 
                                    <span>Số điện thoại:</span> 
                                    <span >{order.user.phonenumber}</span>
                                </div>
                                <div className='infor-row'> 
                                    <span >Email:</span> 
                                    <span>{order.user.email}</span>
                                </div>
                                <div className='infor-row'> 
                                    <span >Địa chỉ:</span> 
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <span>{`${order.shippingAddress.street}`}</span>
                                        <span>{`${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}`}</span>
                                    </div>
                                </div>
                                <div className='infor-row'> 
                                    <span >Phương thức thanh toán:</span> 
                                    <span>{order.payment_method}</span>
                                </div>
                            </div>
                        </div>
                        <div class="email-footer">
                         <p>Nếu có thắc mắc xin vui lòng liên hệ đến hotlinne 0387547592.</p>
                        </div>
                    </div>
                  
            </div> */}
        </div>
    );
};

export default DetailOrder;
