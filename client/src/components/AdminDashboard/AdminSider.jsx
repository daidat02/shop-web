import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';

const { Sider } = Layout;

const items = [
  {
    key: '/admin/home',
    icon: <HomeOutlined />,
    label: 'Trang Chủ',
  },
  {
    key: '/admin/category',
    icon: <AppstoreOutlined />,
    label: 'Danh Mục ',
  },
  
  {
    key: '/admin/order',
    icon: <ShoppingCartOutlined />,
    label: 'Đơn Hàng',
  },
  {
    key: '/admin/voucher',
    icon: <GiftOutlined />,
    label: 'Khuyến Mãi',
  },
  {
    key: 'manage',
    icon: <TeamOutlined />,
    label: 'Quản lý',
    children: [
      {
        key: '/admin/staff',
        icon: <TeamOutlined />,
        label: 'Quản lý nhân sự',
      },
      {
        key: '/admin/account',
        icon: <UserOutlined />,
        label: 'Quản lý tài khoản',
      },
    ],
  },
  {
    key: 'user',
    icon: <SettingOutlined />,
    label: 'Tài Khoản',
    children: [
      {
        key: '/admin/me',
        icon: <UserOutlined />,
        label: 'Thông tin tài khoản',
      },
      {
        key: '/admin/logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
      },
    ],
  },
];

const AdminSider = ({ onCreateCategoryClick }) => { // Nhận hàm từ props
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const onClick = (e) => {
    if (e.key === 'create-category') { // Nếu nhấn vào Tạo Danh Mục
      onCreateCategoryClick(); // Mở Drawer
    } else if (e.key === '/admin/logout') {
      // handleLogout(); // Thêm hàm xử lý đăng xuất nếu cần
    } else {
      navigate(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
    >
      <div className="header-menu"></div>

      <Menu
        onClick={onClick}
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default AdminSider;
