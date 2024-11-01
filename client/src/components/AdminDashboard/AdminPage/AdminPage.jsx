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
const { Header, Content, Footer, Sider } = Layout;



const AdminHome = () => {
  const [visible, setVisible] = useState(false); // Trạng thái mở Drawer
  const [currentComponent, setCurrentComponent] = useState(null); // Trạng thái component hiện tại
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

 
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
      {/* Cố định Header */}
      <Header style={{ 
        position: 'fixed', 
        width: '100%', 
        zIndex: 1, 
        padding: 0, 
        background: colorBgContainer, 
        height: 70 
      }} />
    
      <Layout>
        
          <AdminSider onCreateCategoryClick={() => showDrawer(<CreateCategoryForm />)} />

        {/* Content có thể cuộn */}
        <Layout style={{maxHeight:'100vh'}} >
          <Content style={{ 
              marginTop: '70px ', 
              overflow: 'auto', 
              minHeight: 360, 
            }}>
              <Routes>
                <Route path="home" element={<div>Trang chủ Admin</div>} />
                <Route path="category" element={<AdminCategory />} />
                <Route path="products" element={<AdminProduct />} />
                <Route path="/create-product/:categoryId" element={<CreateProduct />} />
              </Routes>
            </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminHome;
