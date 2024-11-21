import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, theme, Drawer } from 'antd';
import 'antd/dist/reset.css';
import '../../AdminDashboard/admin.css';
import AdminSider from '../AdminSider';
import AdminCategory from './AdminCategory/AdminCategory';
import CreateCategoryForm from './AdminCategory/CreateCategoryForm';
import AdminProduct from '../AdminPage/AdminProduct/AdminProduct';
import CreateProduct from './AdminProduct/CreateProduct';
import AdminOrder from './AdminOrder/AdminOrder';
import AdminCustomer from './AdminCustomer/AdminCustomer';
import AdminDiscount from './AdminDiscount/AdminDiscount';
import AdminOrderDetail from './AdminOrder/AdminOrderDetail';
import ChatApp from '../../ChatApp/ChatApp';
import HeaderComponent from '../../AdminHeader/HeaderAdmin';
import AdminHome from './AdminHome/AdminHome';
import Login from '../../Auth/Login';
import { useSelector } from 'react-redux';
const { Header, Content, Footer, Sider } = Layout;

const AdminDashBoard = () => {
  const initialAccount = useSelector((state)=> state.auth?.account)
  const user = initialAccount?.user
  const [visible, setVisible] = useState(false); // Trạng thái mở Drawer
  const [currentComponent, setCurrentComponent] = useState(null); // Trạng thái component hiện tại
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const navigate = useNavigate(); // Dùng để điều hướng

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập (ví dụ, kiểm tra localStorage)
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/admin/'); // Điều hướng tới trang Login nếu chưa đăng nhập
    }
  }, [navigate]);

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

  if (!isLoggedIn) {
    return <Login />; // Hiển thị trang Login nếu chưa đăng nhập
  }

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
      }} >
        <HeaderComponent/>
      </Header>
    
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
              <Route path="home" element={<AdminHome/>} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="products" element={<AdminProduct />} />
              <Route path="/create-product/:categoryId" element={<CreateProduct />} />
              <Route path="orders" element={<AdminOrder/>} />
              <Route path="customers" element={<AdminCustomer/>} />
              <Route path="discounts" element={<AdminDiscount/>} />
              <Route path="order/order-detail/:orderId" element={<AdminOrderDetail/>}/>
              <Route path='/chat' element = {<ChatApp/>}/>   
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashBoard;
