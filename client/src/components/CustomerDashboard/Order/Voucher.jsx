import React, { useState } from 'react';
import { Radio, Input, Button } from 'antd';
import NotificationMessage from '../../Message/NotificationMessage';

const Voucher = ({ VoucherData, selectedVoucher, handleVoucherChange, onCancel, onApply }) => {
    const [voucherCode, setVoucherCode] = useState(''); // State lưu mã voucher nhập vào

    // Hàm xử lý khi người dùng nhập mã voucher
    const handleVoucherInputChange = (e) => {
        setVoucherCode(e.target.value); // Cập nhật mã voucher khi người dùng nhập
    };

    // Hàm kiểm tra và áp dụng voucher
    const handleApplyVoucher = () => {
        const voucher = VoucherData.find((voucher) => voucher.code === voucherCode); // Tìm voucher theo mã nhập vào
        if (voucher) {
            handleVoucherChange(voucher.code); // Cập nhật voucher đã chọn
            onApply(); // Áp dụng voucher
        } else {
            // Thông báo lỗi nếu mã voucher không hợp lệ
            NotificationMessage.error("Voucher không hợp lệ");
        }
    };

    return (
        <div className='voucher-container'>
            <div className="voucher-header">
                <h2>Chọn Voucher</h2>
            </div>

            <div className="voucher-content">
                <div className='voucher-filter'>
                    <span>Mã voucher</span>
                    <Input
                        onChange={handleVoucherInputChange} // Cập nhật mã voucher khi nhập
                        value={voucherCode} // Đảm bảo giá trị mã voucher luôn được đồng bộ với state
                        placeholder='Nhập Mã Voucher'
                    />
                    <Button onClick={handleApplyVoucher}>Áp dụng</Button>  
                </div>
                <div className="divider"></div>

                <div className='list-item'>
                    <h4>Mã Giảm giá</h4>
                    <div className="divider"></div>

                    <Radio.Group
                        onChange={(e) => handleVoucherChange(e.target.value)} // Cập nhật voucher đã chọn khi chọn radio
                        style={{
                            width: '100%',
                        }}
                    >
                        {VoucherData.map((voucher) => (
                            <Radio
                                key={voucher.code}
                                value={voucher.code}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
                            >
                                <div className='voucher-item'>
                                    <strong>{voucher.code}</strong> - Giảm {voucher.type === "fixed" ? `${voucher.discount} VND` : `${voucher.discount}%`}
                                    <p>Áp dụng cho đơn hàng từ: {voucher.minOrderValue.toLocaleString()} VND</p>
                                    <p>Hạn dùng: {voucher.validUntil}</p>
                                </div>
                                <div className="divider"></div>
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
                <div className="divider"></div>

                <div className='voucher-action'>
                    <Button onClick={onApply}>Áp dụng</Button>
                    <Button onClick={onCancel}>Hủy</Button>
                </div>
            </div>
        </div>
    );
}

export default Voucher;
