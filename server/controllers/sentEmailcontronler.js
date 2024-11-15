import { createRandomID, STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
import transporter from '../configs/OTP_Config.js';


const sendInfoOrder = async (req, res) => {
    const { email, order_id } = req.body;

    try {
        const emailExist = await DB_Connection.Account.findOne({ email: email });
        if (!emailExist) {
            return res.status(STATUS.NOT_FOUND).json({
                success: false,
                message: 'Không tìm thấy email đã trong hệ thống!!!'
            });
        }

        const order = await DB_Connection.Order.findOne({ order_id: order_id }).populate([
            { path: 'user' },
            {
                path: 'items',
                populate: {
                    path: 'product'
                }
            },
            { path: 'shippingAddress' },
        ]);

        // Format datetime
        const orderDate = new Date(order?.createdAt);
        const formattedDateTime = orderDate.toLocaleString('vi-VN', { hour12: false });

        const mailOptions = {
            from: "daidat1202@gmail.com",
            to: email,
            subject: 'Xác nhận đơn hàng',
            html: `
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <!-- Main Container -->
                                    <table width="450" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 6px; border: 1px solid #909090;">
                                        <!-- Header -->
                                        <tr>
                                            <td align="center" style="padding: 20px;">
                                                <h2 style="margin: 0;">Thông tin đơn hàng</h2>
                                            </td>
                                        </tr>
        
                                        <!-- Greeting -->
                                        <tr>
                                            <td style="padding: 0 20px;">
                                                <p style="margin: 0 0 25px;">Xin chào ${order.user.user_name},</p>
                                                <p style="margin: 0 0 10px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                                                <p style="margin: 0 0 10px;">Xác nhận đơn hàng #${order.order_id} của bạn đã đặt thành công lúc ${formattedDateTime}.</p>
                                                <p style="margin: 0 0 20px;">Chi tiết đơn hàng của bạn như sau:</p>
                                            </td>
                                        </tr>
        
                                        <!-- Order Details -->
                                        <tr>
                                            <td style="padding: 0 20px;">
                                                <table width="100%" cellpadding="10" cellspacing="0" border="0" style="border: 1px solid #909090; border-radius: 6px; margin-bottom: 20px;">
                                                    <tr>
                                                        <td colspan="4" style="border-bottom: 1px solid #909090;">
                                                            <h5 style="margin: 0;">Chi tiết đơn hàng</h5>
                                                        </td>
                                                    </tr>
                                                    <tr style="background-color: #f8f9fa; font-size: 12px;">
                                                        <th align="left" style="padding: 10px;">Tên Sản phẩm</th>
                                                        <th align="center" style="padding: 10px;">Số lượng</th>
                                                        <th align="right" style="padding: 10px;">Đơn Giá</th>
                                                        <th align="right" style="padding: 10px;">Thành tiền</th>
                                                    </tr>
                                                    ${order.items.map(item => `
                                                        <tr style="font-size: 12px;">
                                                            <td align="left" style="padding: 10px;">${item.product.product_name}</td>
                                                            <td align="center" style="padding: 10px;">x${item.quantity} </td>                                                           
                                                             <td align="right" style="padding: 10px;">${item.product.price * item.quantity} VND</td>
                                                            <td align="right" style="padding: 10px;">${item.product.price * item.quantity} VND</td>
                                                        </tr>
                                                    `).join('')}
                                                    <tr style="font-size: 12px;">
                                                        <td colspan="3" align="left" style="padding: 10px; border-top: 1px solid #dee2e6;">Tổng tiền:</td>
                                                        <td align="right" style="padding: 10px; border-top: 1px solid #dee2e6;">${order.totalBill} VND</td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td colspan="3" align="left" style="padding: 10px;">Phí vận chuyển:</td>
                                                        <td align="right" style="padding: 10px;">${order.shippingCost} VND</td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td colspan="3" align="left" style="padding: 10px;">Giảm giá:</td>
                                                        <td align="right" style="padding: 10px;">${order.discountAmount} VND</td>
                                                    </tr>
                                                    <tr style="font-size: 12px; font-weight: bold;">
                                                        <td colspan="3" align="left" style="padding: 10px;">Tổng hóa đơn:</td>
                                                        <td align="right" style="padding: 10px;">${order.finalAmount} VND</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
        
                                        <!-- Customer Information -->
                                        <tr>
                                            <td style="padding: 0 20px 20px;">
                                                <table width="100%" cellpadding="10" cellspacing="0" border="0" style="border: 1px solid #909090; border-radius: 6px;">
                                                    <tr>
                                                        <td colspan="2" style="border-bottom: 1px solid #909090;">
                                                            <h5 style="margin: 0;">Thông tin người đặt:</h5>
                                                        </td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td width="30%" style="padding:5px 10px;">Họ tên:</td>
                                                        <td align="right" style="padding:5px 10px; ">${order.user.user_name}</td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td style="padding:5px 10px;">Số điện thoại:</td>
                                                        <td align="right" style="padding:5px 10px;">${order.user.phonenumber}</td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td style="padding:5px 10px;">Email:</td>
                                                        <td align="right" style="padding:5px 10px;">${order.user.email}</td>
                                                    </tr>
                                                    <tr style="font-size: 12px;">
                                                        <td style="padding: 10px;">Địa chỉ:</td>
                                                        <td align="right" style="padding:5px 10px;">
                                                            ${order.shippingAddress.street}<br>
                                                            ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}
                                                        </td>
                                                    </tr>
                                                    <tr  style="font-size: 12px;">
                                                        <td align="left" style="padding:5px 10px;">Phương thức thanh toán:</td>
                                                        <td align="right"style="padding:5px 10px width:150px;">${order.payment_method}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
        
                                        <!-- Footer -->
                                        <tr>
                                            <td align="center" style="padding: 0 20px 20px;">
                                                <p style="font-size: 12px; color: #666;">Nếu có thắc mắc xin vui lòng liên hệ đến hotline 0298989898.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(STATUS.OK).send({
            success: true,
            message: `Thông tin đơn hàng ${order_id} đã được gửi tới email ${email}`
        });
    } catch (error) {
        return res.status(STATUS.SERVER_ERROR).json({ error: error.message });
    }
};


export{
    sendInfoOrder
}