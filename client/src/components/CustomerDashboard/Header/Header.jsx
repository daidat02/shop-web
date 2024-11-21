import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, LogOut, Bold } from 'lucide-react';
import { Input, Avatar, Badge ,Popover, Button, List, Typography} from 'antd';
import { SearchOutlined, BellOutlined, UserOutlined, ShopOutlined,MessageOutlined,NotificationOutlined,ShoppingOutlined,
     UnorderedListOutlined, SettingOutlined,QuestionCircleOutlined,UserAddOutlined ,LockOutlined,LogoutOutlined} from '@ant-design/icons';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileUser } from '../../../api/API_User';
import tokenManager, { createAxiosInstance } from '../../../createInstance';
import { logoutUser } from '../../../api/API_Auth';
import NotificationMessage from '../../Message/NotificationMessage';
const { Text } = Typography;

const Header = () => {
    const initialAccount = useSelector((state) => state.auth?.account);
    const initialuser = initialAccount?.user;
    const accessToken = initialAccount?.accessToken;
    const [profileUser, setProfileUser] = useState();
    const cartItemCount = useSelector((state)=>state.cart?.countItems|| 0);
    const notificationCount = useSelector((state) => state.notifications?.length || 10);
    const [popoverVisible, setPopoverVisible] = useState(false); // State quản lý Popover
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let axiosJWT = createAxiosInstance(initialAccount,dispatch);

 // Dữ liệu mẫu thông báo
    const notifications = [
        {
            id: 1,
            type: 'message',
            title: 'Tin nhắn mới',
            content: 'Bạn có tin nhắn mới từ Nguyễn Văn A',
            time: '5 phút trước',
            read: false
        },
        {
            id: 2,
            type: 'system',
            title: 'Cập nhật hệ thống',
            content: 'Hệ thống sẽ bảo trì vào ngày 20/11/2024',
            time: '1 giờ trước',
            read: true
        },
        {
            id: 3,
            type: 'order',
            title: 'Đơn hàng mới',
            content: 'Có đơn hàng mới #12345 cần xử lý',
            time: '2 giờ trước',
            read: false
        }
    ];

    const categories = [
        {
            category_id: "1324234",
            category_name: "Sale",
            createdAt: "2024-11-01T02:43:26.691Z",
            images: [
                {
                    url: "https://res.cloudinary.com/dqzzuzfd6/image/upload/v1730429003/fjxqppwc5yjd40vhqrlg.webp",
                    // You can add other image properties if needed
                }
            ],
            products: [],
            state: "active"
        },
        // You can add more categories here following the same structure
        {
            category_id: "5678901",
            category_name: "Điện Tử",
            createdAt: "2024-11-02T10:15:30.123Z",
            images: [
                {
                    url: "https://example.com/electronics-category.jpg"
                }
            ],
            products: [],
            state: "active"
        }
    ];

   

    const fetchApi = async () => {
        try {
          const profileData = await getProfileUser(accessToken,axiosJWT);
          setProfileUser(profileData.data);
        } catch (error) {
          console.log("Không thể tải danh mục");
        }
    };

    useEffect(() => {
    fetchApi();
    }, []);
    
    const handleClick = (path)=>{
        navigate(path)
        setPopoverVisible(false);
    }
    const handleLogout = async () => {
        try {
            const response = await logoutUser(dispatch,accessToken,axiosJWT);
            if(response.success){
                NotificationMessage.success(response.message);
                navigate('/')
            }else{
                NotificationMessage.error('Lỗi khi đăng xuất');
            }
        } catch (error) {
            console.log(error)
        }
        // Xử lý đăng xuất
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Thêm xử lý tìm kiếm
    };
    const categoryContent = (
        <div className="category-container" style={{ width: 350 }}>
            <div className="category-header" style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid #f0f0f0',
            }}>
                <Text strong>Danh Mục Sản Phẩm</Text>
            </div>
            
            <List
                className="category-list"
                style={{ maxHeight: '400px', overflow: 'auto' }}
                dataSource={categories}
                renderItem={category => (
                    <List.Item 
                        className="category-item"
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onClick={() => handleCategoryClick(category)}
                    >
                        <List.Item.Meta
                            avatar={
                                category.images && category.images.length > 0 ? 
                                <Avatar src={category.images[0].url} /> : 
                                <Avatar icon={<ShopOutlined />} />
                            }
                            title={<Text strong>{category.category_name}</Text>}
                            description={
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Ngày tạo: {new Date(category.createdAt).toLocaleDateString()}
                                </Text>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
    const handleCategoryClick = (category) => {
        console.log('Selected category:', category);
        navigate(`/category/${category.category_id}`);
    };
    const notificationContent = (
        <div className="notification-container" style={{ width: 350 }}>
            <div className="notification-header" style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text strong>Thông báo</Text>
                <Button type="link" size="small">Đánh dấu tất cả đã đọc</Button>
            </div>
            
            <List
                className="notification-list"
                style={{ maxHeight: '400px', overflow: 'auto' }}
                dataSource={notifications}
                renderItem={item => (
                    <List.Item 
                        className="notification-item"
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            background: item.read ? 'white' : '#e6f7ff',
                            transition: 'all 0.3s'
                        }}
                        onClick={() => handleNotificationClick(item)}
                    >
                        <List.Item.Meta
                            avatar={getNotificationIcon(item.type)}
                            title={<Text strong>{item.title}</Text>}
                            description={
                                <div>
                                    <Text style={{ fontSize: '14px' }}>{item.content}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
            
            <div className="notification-footer" style={{
                padding: '12px 16px',
                borderTop: '1px solid #f0f0f0',
                textAlign: 'center'
            }}>
                <Button type="link" block>Xem tất cả thông báo</Button>
            </div>
        </div>
    );
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'message':
                return <MessageOutlined style={{ color: '#1890ff' }} />;
            case 'system':
                return <NotificationOutlined style={{ color: '#faad14' }} />;
            case 'order':
                return <ShoppingOutlined style={{ color: '#52c41a' }} />;
            default:
                return <BellOutlined style={{ color: '#8c8c8c' }} />;
        }
    };
    const handleNotificationClick = (notification) => {
        // Xử lý khi click vào thông báo
        console.log('Clicked notification:', notification);
        // Thêm logic chuyển hướng hoặc xử lý khác tùy theo loại thông báo
    };
    const userActions = (
        <div className='profile-container'>
            <div className='profile-header'>
                <Avatar icon={<UserOutlined />} />
                <span>{profileUser?.user_name || ''}</span>
            </div>
            <div className='status-input'>
                 <Input
                    placeholder='Cập Nhật Trạng Thái'
                    style={{width:'90%'}}
                 />   
            </div>
            <div className='list-actions'>
                <ul>
                    <li onClick={()=> handleClick('/profile')}><UserOutlined/><span>Thông tin cá nhân</span></li>
                    <li onClick={()=> handleClick('/')}> <ShopOutlined /><span>Trang chủ</span></li>
                    <li onClick={()=> handleClick('/post')}> <LockOutlined /><span>Bài viết và hoạt động</span></li>
                    <li onClick={()=> handleClick('/setting')} > <SettingOutlined /> <span>Cài đặt & Quyền riêng tư</span></li>
                    <li onClick={()=> handleClick('/help')} ><QuestionCircleOutlined /> <span>Trung tâm hỗ trợ</span></li>
                </ul>
            </div>
            <div className='profile-footer'>
                <div className='add-container'>
                     <div className='add-account' onClick={()=> handleClick('/login')}>
                        <UserAddOutlined />
                        <span>Thêm Tài Khoản</span>
                     </div>
                </div>
                <div className='logout-container'>
                <Button className='btn-logut' onClick={()=> handleLogout()} >
                    <LogoutOutlined /> Đăng Xuất
                </Button>
                </div>
            </div>
        </div>
    );
      
    return (
        <div className="header-container">
            <div className="header-content">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src="/images/logo_shop.png" alt="logo" />
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
                {initialuser? ( 
                <div className="action-container">
                        <div className="cart" onClick={() => navigate('/cart')}>
                            <Badge color="blue"  count={cartItemCount} showZero>
                                <ShoppingCart style={{ fontSize: 22 }} />
                            </Badge>
                        </div>
                    
                        <div className="bell">
                            <Popover placement="bottomRight" content={notificationContent} trigger="click">
                                <Badge dot={notificationCount} overflowCount={99} showZero>
                                    <BellOutlined 
                                        style={{ fontSize: 22}} 
                                    />
                                </Badge>
                            </Popover>
                        </div>
                   
                        <div className="avatar">
                            <Popover 
                                placement="bottomRight"
                                content={userActions} 
                                trigger="click"
                                visible={popoverVisible}
                                onVisibleChange={(visible) => setPopoverVisible(visible)}
                            >
                                <Avatar icon={<UserOutlined style={{fontSize:'20px'}} />} />
                            </Popover>
                            
                        </div>
                    </div>
                    ):(
                        <div className='btn-navigate-login' onClick={()=> handleClick('login')}>
                            Đăng Nhập
                        </div>
                    )}
            </div>
            <div className="bottom-header">
                <div className="category-dropdown">
                    <Popover 
                        placement="bottomLeft" 
                        content={categoryContent} 
                        trigger="click"
                    >
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
