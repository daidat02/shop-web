import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Breadcrumb, Layout, theme, Drawer } from 'antd';
import 'antd/dist/reset.css';
import '../../AdminDashboard/admin.css';
import AdminSider from '../AdminSider';
import AdminCategory from './AdminCategory/AdminCategory';
import CreateCategoryForm from './AdminCategory/CreateCategoryForm';
import AdminProduct from '../AdminPage/AdminProduct/AdminProduct';
import CreateProduct from './AdminProduct/CreateProduct';
const { Header, Content, Footer } = Layout;

const breadcrumbNameMap = {
  '/admin/home': 'Trang chủ',
  '/admin/category': 'Danh Mục',
  '/admin/order': 'Đơn Hàng',
  '/admin/staff': 'Quản lý nhân sự',
  '/admin/account': 'Quản lý tài khoản',
  '/admin/product': 'Sản Phẩm'
};

const AdminHome = () => {
  const [visible, setVisible] = useState(false); // Trạng thái mở Drawer
  const [currentComponent, setCurrentComponent] = useState(null); // Trạng thái component hiện tại
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i && i !== 'admin');
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/admin/${pathSnippets.slice(0, index + 1).join('/')}`;
    return <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]} </Breadcrumb.Item>;
  });

  const breadcrumbItems = [<Breadcrumb.Item key="home">Trang chủ</Breadcrumb.Item>].concat(extraBreadcrumbItems);

  // Hàm mở Drawer và hiển thị component cụ thể
  const showDrawer = (component, categoryId) => {
    setCurrentComponent(React.cloneElement(component, { categoryId })); 
    setVisible(true);
  };
  // Hàm đóng Drawer
  const onClose = () => {
    setVisible(false);
    setCurrentComponent(null); // Reset component hiện tại khi đóng
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
     
      <AdminSider onCreateCategoryClick={() => showDrawer(<CreateCategoryForm />)} />
   
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}  >HEADER</Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>{breadcrumbItems}</Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Drawer
              title="Nhập Thông Tin"
              placement="right"
              onClose={onClose}
              open={visible}
            >
              {currentComponent} {/* Hiển thị component hiện tại */}
            </Drawer>

            <Routes>
              <Route path="home" element={<div>Trang chủ Admin</div>} />
              <Route path="category" element={<AdminCategory />} />
              <Route
                path="products/:categoryId"
                element={
                  <AdminProduct />
                }
              />
              <Route path="/create-product/:categoryId" element={<CreateProduct />} />

            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminHome;
