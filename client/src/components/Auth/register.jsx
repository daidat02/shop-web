import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { message } from "antd";
import { UserOutlined, LockOutlined, Loading3QuartersOutlined } from '@ant-design/icons'; // Import icon loading
import OtpInput from "./otpInput";
import { registerAccount, sendOTP } from "../../api/API_Auth";
import NotificationMessage from "../Message/NotificationMessage";

const Register = () => {
    const [regData, setRegData] = useState({user_name:'', email:'' , phonenumber:'',password:'',otp:''});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    const handleSentOTPSubmit = async (event) => {
        event.preventDefault();
        // phone validations
        if (!regData.email) {
            console.log("Dữ liệu thiếu:", regData);
            NotificationMessage.error(" Vui lòng nhập đủ thông tin!!");
            return;
        }

        // Cập nhật trạng thái loading
        setLoading(true);

        // Call BE API
        const respone = await sendOTP(dispatch, regData.email);
        
        // Tắt loading sau khi nhận phản hồi
        setLoading(false);

        // show OTP Field
        if(respone?.success) {
            setShowOtpInput(true);
        } else {
            NotificationMessage.error("Lỗi khi đăng ký, vui lòng kiểm tra lại thông tin!!");
        }
    };

    const onRegisterSubmit = async (otp) => {
        const updatedData = { ...regData, otp: otp };
        setRegData(updatedData);
        try {
            setLoading(true);
           const respone = await registerAccount(dispatch, navigate, updatedData);
           if(respone.success){
            NotificationMessage.success("Đăng ký tài khoản thành công!!");
            setLoading(false)
            console.log("Login Successful", otp);
           }else{
            NotificationMessage.error("Đăng ký tài khoản không thành công thành công!!");
           }
        } catch (error) {
            NotificationMessage.error(error.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-img"><img src="/images/register_img.jpeg" alt="" /></div>
            <div className="login-container">
                <div className="login-form-container">
                    <h1 className="login-title">Đăng ký</h1>

                    {(!showOtpInput ? (
                        <form className="login-form" onSubmit={handleSentOTPSubmit}>
                            <label>Tên:</label>
                            <div className="input-group">
                                <div>
                                    <UserOutlined className="input-icon" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Nhập tên"
                                    onChange={(e) => setRegData({...regData, user_name: e.target.value})}
                                />
                            </div>
                            <label>E-mail:</label>
                            <div className="input-group">
                                <LockOutlined className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                                />
                            </div>
                            <label>Điện thoại:</label>
                            <div className="input-group">
                                <LockOutlined className="input-icon" />
                                <input
                                    type="phonenumber"
                                    id="phonenumber"
                                    placeholder="Nhập số điện thoại"
                                    onChange={(e) => setRegData({...regData, phonenumber: e.target.value})}
                                />
                            </div>
                            <label>Mật Khẩu:</label>
                            <div className="input-group">
                                <LockOutlined className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu"
                                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                                />
                            </div>
                            <label>Xác nhận mật khẩu:</label>
                            <div className="input-group">
                                <LockOutlined className="input-icon" />
                                <input
                                    type="password"
                                    id="confirm_password"
                                    placeholder="Nhập lại mật khẩu"
                                    // onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <p className="login-footer">
                                <Link to="/register">Quên mật khẩu?</Link>
                            </p>
                            <button type="submit" className="login-button">
                                {loading ? <Loading3QuartersOutlined spin /> : 'Đăng Ký'}
                            </button>
                        </form>
                    ) : (
                        <div className="otp-confirm-container">
                            <p className="otp-title">Mã xác nhận đã được gửi đến {regData.email} {loading ? <Loading3QuartersOutlined spin /> : ''}</p>
                            <OtpInput length={6} onOtpSubmit={onRegisterSubmit} />
                            <p className="otp-back">
                                <Link to="/login">Quay lại trang đăng nhập</Link>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Register;
