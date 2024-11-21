import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { MailOutlined } from '@ant-design/icons';
import { loginUser } from "../../api/API_Auth";
import NotificationMessage from "../Message/NotificationMessage";
import { resetPassword } from "../../api/API_SendEmail";
import LoadingOverlay from "../CustomerDashboard/ActionComponents/LoadingOverlay";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isResetPass,setIsResetPass]= useState(false);
    const[isLoading,setIsLoading] = useState(false)

    const handelResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const response = await resetPassword(email);
        if (response.success) {
            NotificationMessage.success(response.message);
            setIsResetPass(true)
            setIsLoading(false)
        } else {
            NotificationMessage.error(response.message);
        }
    };
    
    return (
        <div className="login-page">
           <LoadingOverlay isLoading={isLoading}/>
            <div className="login-img"><img src="/images/login_img.jpeg" alt="" /></div>
            <div className="login-container">

                {!isResetPass ? (
                     <div className="login-form-container">
                     <h1 className="login-title">Quên Mật Khẩu</h1>
                     <form className="login-form" onSubmit={handelResetPassword}>
                         <label>Email:</label>
                         <div className="input-group">
                             <div>
                                 < MailOutlined className="input-icon" />
                             </div>
                             <input
                                 type="text"
                                 id="email"
                                 placeholder="Nhập email"
                                 onChange={(e) => setEmail(e.target.value)}
                             />
                         </div>
                     
                         <button type="submit" className="login-button">Lấy Lại mật Khẩu</button>
                     </form>
                    
                     <p className="login-footer">
                          <Link to="/login">Quay lại trang đăng nhập</Link>
                     </p>
                     
                 </div>
                ):(
                    <div className="login-form-container">
                    <h1 className="login-title">Đã Gửi Thông Tin</h1>
                     <button onClick={()=> navigate('/login')} className="login-button">Quay lại trang đăng nhập</button>
                    </div>
                )}
               

                
            </div>
        </div>
    );
};

export default ResetPassword;