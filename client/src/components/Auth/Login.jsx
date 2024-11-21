import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from "../../api/API_Auth";
import NotificationMessage from "../Message/NotificationMessage";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            email: username,
            password: password,
        };

        const response = await loginUser( dispatch,newUser);
        console.log(response)
        if (response.success) {
            if(response?.user?.role === 'admin'){
                navigate(`/admin/home`)
            }else{
                navigate(`/`)
            }
            NotificationMessage.success("Đăng nhập thành công!");

        } else {
            NotificationMessage.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
    };
    
    return (
        <div className="login-page">
            <div className="login-img"><img src="/images/login_img.jpeg" alt="" /></div>
            <div className="login-container">
                <div className="login-form-container">
                    <h1 className="login-title">Đăng nhập</h1>
                    <form className="login-form" onSubmit={handleLogin}>
                        <label>Tên Đăng Nhập:</label>
                        <div className="input-group">
                            <div>
                                <UserOutlined className="input-icon" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                placeholder="Tên đăng nhập"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <label>Mật Khẩu:</label>
                        <div className="input-group">
                            <LockOutlined className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="Mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <p className="forgot-password">
                        <Link to="/reset-pass">Quên mật khẩu?</Link>
                         </p>
                        <button type="submit" className="login-button">Đăng nhập</button>
                    </form>
                   
                    <p className="login-footer">
                       Bạn chưa có tài khoản? <Link to="/register">Tạo tài khoản ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;