import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import { returnPassword } from "../../api/API_SendEmail";
import NotificationMessage from "../Message/NotificationMessage";
import LoadingOverlay from "../CustomerDashboard/ActionComponents/LoadingOverlay";

const ReturnPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const[isLoading,setIsLoading] = useState(false)
    useEffect(() => {
        // Lấy token từ URL
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        // Kiểm tra nếu token không tồn tại
        if (!token) {
            NotificationMessage.error('Không tìm thấy token');
            return;
        }
        setIsLoading(true)
        const fetchApi = async () => {
            try {
                const response = await returnPassword(token);
                if(response.success) {
                    NotificationMessage.success('Đặt lại mật khẩu thành công');
                } else {
                    NotificationMessage.error('Đặt lại mật khẩu thất bại');
                }
            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }

        fetchApi(); // Gọi hàm fetchApi

    }, [location]);

    return (
        <div className="login-page">
            <LoadingOverlay isLoading={isLoading}/>
            <div className="login-img">
                <img src="/images/login_img.jpeg" alt="" />
            </div>
            <div className="login-container">
                <div className="login-form-container">
                    <h1 className="login-title">Lấy Lại Mật Khẩu Thành Công</h1>
                    <button onClick={() => navigate("/login")} className="login-button">
                        Quay lại trang đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnPassword;
