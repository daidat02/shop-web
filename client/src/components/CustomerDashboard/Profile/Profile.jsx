import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Button, Breadcrumb, Modal, Avatar,Checkbox } from 'antd';
import { FacebookFilled, InstagramOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import './profile.css';
import TabOrder from './MyOrderComponent';
import { addAddress, getProfileUser, getShippingAddress, updateAddressDefault } from '../../../api/API_User';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LoadingOverlay from '../ActionComponents/LoadingOverlay';
import { getMyOrder } from '../../../api/API_Order';
import { createAxiosInstance } from '../../../createInstance';
import UserProfileTabs from './UserProfileTabs';
import AddressComponent from './AddressComponent';
import NotificationMessage from '../../Message/NotificationMessage';

dayjs.extend(relativeTime); // Kích hoạt plugin relativeTime của dayjs

const { Option } = Select;

const Profile = () => {
  const initialAccount = useSelector((state) => state.auth?.account);
  const accessToken = initialAccount?.accessToken;

  const [profileUser, setProfileUser] = useState();
  const [orders, setOrders]= useState();  
  const [addressData, setAddressData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(addressData[0]); // Địa chỉ mặc định
  const [selectedAddress, setSelectedAddress] = useState(shippingAddress); // Địa chỉ được chọn trong modal

  const [isLoading,setIsLoading]= useState(false)
  const [updateProfile,setUpdateProfile]= useState(true) 
  const dispatch = useDispatch();
  let axiosJWT = createAxiosInstance(initialAccount,dispatch);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = () => {
    setIsModalOpen(true);
    // form.setFieldsValue(shippingAddress); // Đổ dữ liệu vào form
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleAddressChange = (addressId) => {
    const address = addressData.find((addr) => addr._id === addressId);
    setSelectedAddress(address); // Cập nhật địa chỉ tạm thời
    console.log('address', address )
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handelUpdateAddressDefault = async(addressId)=>{
    try {
        const response = await updateAddressDefault(addressId)
        console.log('Id',addressId)
        if(response.success){
            NotificationMessage.success(response.message);
            fetchApi();
            setIsModalOpen(false)
        }else{
            NotificationMessage.success(response.message)
        }
    } catch (error) {
        console.log(error);
  }
}
const handleAddNewAddress = async (newAddress) => {
  console.log('New Address from child:', newAddress);
  try {
    const response = await addAddress(accessToken,axiosJWT,newAddress);
    if(response.success){     
      fetchApi();
      NotificationMessage.success(response.message)
    }else{
      NotificationMessage.error(response.message)
    }
  } catch (error) {
    console.log(error)
  }
  
};
  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    setIsLoading(true)
    try {
      const profileData = await getProfileUser(accessToken,axiosJWT);
      setProfileUser(profileData.data);
      const orderData = await getMyOrder(accessToken,axiosJWT);
      setOrders(orderData.data);
      const userAddressData = await getShippingAddress(accessToken);
      setAddressData(userAddressData.data)
    } catch (error) {
      console.log("Không thể tải danh mục");
    }finally{
      setIsLoading(false)
      console.log(orders)
    }
  };

  const formatLastOrder = (lastOrderDate) => {
    const now = dayjs();
    const lastOrder = dayjs(lastOrderDate);

    // Nếu đơn hàng là trong tuần này
    if (lastOrder.isSame(now, 'week')) {
      return `${lastOrder.format('dddd, HH:mm')} (trong tuần)`;
    }
    // Nếu đơn hàng là trong tháng này
    if (lastOrder.isSame(now, 'month')) {
      return `${lastOrder.format('DD/MM/YYYY, HH:mm')} (trong tháng)`;
    }
    // Nếu đơn hàng cách đây 1 tuần
    if (lastOrder.isSame(now.subtract(1, 'week'), 'week')) {
      return `${lastOrder.format('dddd, HH:mm')} (1 tuần trước)`;
    }
    // Đơn hàng cách đây hơn 1 tháng
    return lastOrder.fromNow();  // Hiển thị như "3 tháng trước" hoặc "5 năm trước"
  };

  return (
    <div className='profile-content-container'>
      <LoadingOverlay isLoading={isLoading}/>
      <div className='profile-detail-container'>
        <Breadcrumb style={{ padding: '25px 0' }}>
          <Breadcrumb.Item><a>Trang Chủ</a></Breadcrumb.Item>
          <Breadcrumb.Item>Thông tin cá nhân</Breadcrumb.Item>
        </Breadcrumb>
        <div className='profile'>
          <div className='profile-detail'>
            <div className='profile-info'>
              <div className='profile-info-header'>
                <Avatar className='avatar' icon={<UserOutlined style={{ fontSize: '70px' }} />}  />
                <div className='profile-info-container'>
                  <h2 className='profile-info-name'>{profileUser?.user_name}</h2>
                  <span className='profile-info-joined'>Tham Gia Vào 3 Tháng trước</span>
                  <div className='social-contact'>
                    <FacebookFilled className='social-icon' />
                    <InstagramOutlined className='social-icon' />
                    <TwitterOutlined className='social-icon' />
                  </div>
                </div>
              </div>
            </div>

            <div className='profile-stats profile-footer'>
              <div className='profile-stat'>
                <span className='profile-stat-label'>Tổng Chi tiêu</span>
                <h3 className='profile-stat-value' style={{ textAlign: 'start' }}>
                  {profileUser?.total_spent.toLocaleString()}đ
                </h3>
              </div>
              <div className='profile-stat'>
                <span className='profile-stat-label'>Đơn Hàng Gần Đây</span>
                <h3 className='profile-stat-value' style={{ textAlign: 'start' }}>
                  {profileUser?.last_order ? formatLastOrder(profileUser?.last_order) : 'Chưa có đơn hàng'}
                </h3>
              </div>
              <div className='profile-stat'>
                <span className='profile-stat-label'>Tổng Đơn Hàng</span>
                <h3 className='profile-stat-value' style={{ textAlign: 'end' }}>
                  {profileUser?.order_quantity}
                </h3>
              </div>
            </div>
          </div>

          <div className='profile-address'>
              <div className='address-header' >
                  <h2 className='profile-address-title'>Địa Chỉ Mặc Định</h2>
                  <Tag className='update-address'
                   color='blue' 
                   type="primary"
                   onClick={handleEditClick}
                   style={{cursor:'pointer'}}>Cập nhật</Tag>
              </div>

            <div className='profile-address-content'>
              <div className='profile-address-field'>
                <span className='profile-address-label'>Địa Chỉ</span>
                <div className='profile-address-value'>
                  <p>{profileUser?.address?.street}</p>
                  <p>{`${profileUser?.address?.ward}, ${profileUser?.address?.district}, ${profileUser?.address?.province}`}</p>
                </div>
              </div>

              <div className='profile-footer profile-contact'>
                <div className='profile-address-field'>
                  <span className='profile-address-label'>Số Điện Thoại</span>
                  <span className='profile-address-value'>{profileUser?.phonenumber}</span>
                </div>

                <div className='profile-address-field'>
                  <span className='profile-address-label'>Email</span>
                  <span className='profile-address-value'>{profileUser?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className='table-detail'>
          <TabOrder orderData={orders}/>
        </div>
      </div>
      <Modal
            open={isModalOpen}
            onOk={handleModalClose}
            onCancel={handleModalClose}
            footer={null} 
            className='custom-modal'
          >
            <AddressComponent
                   addressData={addressData}
                   selectedAddress={selectedAddress}
                   handleAddressChange={handleAddressChange}  // Cập nhật voucher tạm thời khi người dùng thay đổi
                   onCancel={handleCancel}
                   onApplyAddress={handleAddNewAddress}
                   updateAddressDefault={handelUpdateAddressDefault}
                />   
          </Modal>
    </div>

    
  );
};

export default Profile;
