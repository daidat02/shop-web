import React, { useState } from 'react';
import { Search, ShoppingCart, LogOut, Bold } from 'lucide-react';
import { Input, Avatar, Badge ,Popover} from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined, ShoppingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const initialAccount = useSelector((state) => state.auth?.account);
    const initialuser = initialAccount?.user;
   
    const cartItemCount = useSelector((state) => state.cart?.items?.length || 10);
    const notificationCount = useSelector((state) => state.notifications?.length || 10);

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xử lý đăng xuất
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Thêm xử lý tìm kiếm
    };
    const content = (
        <div>
          <p>Content</p>
          <p>Content</p>
        </div>
    );
      

    return (
        <div className="header-container">
            <div className="header-content">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src="/images/logo-01-01-1024x355.png" alt="logo" />
                </div>
                <div className="nav">
                    <Input
                        prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
                        placeholder="Tìm kiếm"
                        size="middle"
                        style={{ width: '80%', padding: '5px 10px', borderRadius: '20px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={handleSearch}
                    />
                </div>
                <div className="action-container">
                    <div className="cart" onClick={() => navigate('/cart')}>
                    <Badge color="blue"  count={cartItemCount} showZero>
                        <ShoppingCart style={{ fontSize: 22 }} />
                    </Badge>
                    </div>
                    
                    <div className="bell">
                        <Popover placement="bottomRight" content={content} title="Thông báo" trigger="click">
                            <Badge dot={notificationCount} overflowCount={99} showZero>
                                <BellOutlined 
                                    style={{ fontSize: 22}} 
                                />
                            </Badge>
                        </Popover>
                    </div>
                    <div className="avatar">
                    <Popover placement="bottomRight" content={content} trigger="click">
                          <Avatar icon={<UserOutlined />} />
                     </Popover>
                        
                    </div>
                </div>
            </div>
            <div className="bottom-header">
                <div className="category-dropdown">
                    <Popover placement="bottomLeft" content={content} title="Thông báo" trigger="click">
                        <UnorderedListOutlined />
                        <span>Danh Mục</span>
                    </Popover>
                </div>

               
                <div className="navbar-nav">
                    <ul>
                        <li className="nav-item"><a href="/">Trang Chủ</a></li>
                        <li className="nav-item"><a href="/products">Sản Phẩm</a></li>
                        <li className="nav-item"><a href="/stores">Cửa Hàng</a></li>
                        <li className="nav-item"><a href="/contact">Liên Hệ</a></li>
                        <li className="nav-item"><a href="/notifications">Thông Báo</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
