import React, { useEffect, useState } from 'react';
import { Tag,Input,Modal,Radio,message,Button, Result} from 'antd';
import {Loading3QuartersOutlined} from '@ant-design/icons'; // Import icon loading
import { useLocation, useNavigate ,Link} from 'react-router-dom';
import Voucher from './Voucher';
import { addAddress, getShippingAddress, updateAddressDefault } from '../../../api/API_User';
import { getVoucher } from '../../../api/API_Voucher';
import { useDispatch, useSelector } from 'react-redux';
import './order.css';
import NotificationMessage from '../../Message/NotificationMessage';
import { createOrder } from '../../../api/API_Order';
import { createPaymentUrl } from '../../../api/API_Payment';
import OtpInput from '../../Auth/otpInput';
import { sendOTP } from '../../../api/API_Auth';
import { sendInfoOrder } from '../../../api/API_SendEmail';
import LoadingOverlay from '../ActionComponents/LoadingOverlay';
import { createAxiosInstance } from '../../../createInstance';
import AddressComponent from '../Profile/AddressComponent';

const CheckoutPage = () => {
  const initialAccount = useSelector((state)=> state.auth?.account)
  const user = initialAccount?.user
  const accessToken = initialAccount?.accessToken;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(initialAccount,dispatch);
  const { items, totalPrice } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState("cash_on_delivery");
  const [addressData, setAddressData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(addressData[0]); // Địa chỉ mặc định
  const [selectedAddress, setSelectedAddress] = useState(shippingAddress); // Địa chỉ được chọn trong modal
  const [voucherData,setVoucherData ]= useState([])
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher đã chọn
  const [voucherCode, setVoucherCode] = useState('');
  const [newOrderId,setNewOrderId]=useState('');
  const paymentMethods = [
    { key: 'cash_on_delivery', label: 'Thanh Toán Khi Nhận Hàng' },
    { key: 'vnpay', label: 'VNPay' },
    { key: 'paypal', label: 'PayPal' }
  ];
  
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false); // Modal voucher
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess,setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [showOtpInput,setShowOtpInput]= useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApi = async ()=>{
    try {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập thời gian xử lý
        const userAddressData = await getShippingAddress(accessToken);
        setAddressData(userAddressData.data)

        const defaultAddress = userAddressData.data.find(address => address.isDefault === true);

        setShippingAddress(defaultAddress);
        const voucherIsActive = await getVoucher();
        setVoucherData(voucherIsActive.data);
        setIsLoading(false);
    } catch (error) {
      
    }
  }
  
  useEffect(()=>{
      fetchApi();
  },[]);
  const handleSelectPayment = (method) => {
    setSelectedPayment(method);
  };

  const handleVoucherClick = () => setIsVoucherModalOpen(true); // Mở modal voucher
  const handleVoucherModalClose = () => setIsVoucherModalOpen(false); // Đóng modal voucher

  const handleVoucherChange = (voucherCode) => {
    // Lưu voucher vào trạng thái tạm thời, không cập nhật voucher chính thức
    setVoucherCode(voucherCode);
  };
  const handleApply = () => {
    const voucher = voucherData.find((v) => v.code === voucherCode);
    
    // Kiểm tra nếu voucher không tồn tại hoặc không đủ điều kiện
    if (!voucher) {
      message.error('Voucher không hợp lệ');
      return;
    }
  
    // Kiểm tra điều kiện của voucher (ví dụ: đơn hàng phải có giá trị tối thiểu)
    const isEligible = totalPrice >= voucher.minOrderValue; // Giả sử voucher có thuộc tính minimumOrderValue
    if (!isEligible) {
      message.error('Đơn hàng không đủ điều kiện sử dụng voucher');
      setSelectedVoucher(null); // Đảm bảo voucher không được chọn
      return;
    }
  
    // Nếu đủ điều kiện, áp dụng voucher
    setSelectedVoucher(voucher);
    message.success('Áp dụng voucher thành công');
    setIsVoucherModalOpen(false); // Đóng modal voucher sau khi áp dụng
  };
  
const handleCancel = () => {
    setVoucherCode('');
    setSelectedVoucher(null);
    console.log('Đã hủy voucher');
    setIsVoucherModalOpen(false)
    // Xử lý khi hủy voucher
};  
const calculateDiscount = () => {
  if (!selectedVoucher) return 0;
  return selectedVoucher.type === "fixed"
    ? selectedVoucher.discount
    : (selectedVoucher.discount / 100) * totalPrice;
};
  
  const totalWithDiscount = totalPrice - calculateDiscount();


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
  };
    const handelUpdateAddressDefault = async(addressId)=>{
      try {
          const response = await updateAddressDefault(addressId)
          console.log('Id',addressId)
          if(response.success){
              NotificationMessage.success(response.message);
              fetchApi();
              setShippingAddress(response.data)
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

  if (!items) {
    return (
      <div className='checkout-container'>
         <div className="empty-cart">
          <p>Không có đơn hàng nào được chọn.</p>
        </div>
      </div>
    );
  }

  const handleSentOTPSubmit = async (event) => {
    event.preventDefault();
    // Cập nhật trạng thái loading
    setLoading(true);
    // Call BE API
    console.log(user.email)
    const respone = await sendOTP(dispatch,user?.email);
    // Tắt loading sau khi nhận phản hồi
    setLoading(false);
    // show OTP Field
    if(respone?.success) {
        setShowOtpInput(true);
    } else {
        NotificationMessage.error("Vui lòng kiểm tra lại thông tin!!");
        setShowOtpInput(false);
    }
};

  const orderData = {
    selectedItems: items.map(item => ({ product: item.product._id })),
    shippingAddress: shippingAddress?._id,
    voucherCode:selectedVoucher?.code,
    payment_method:selectedPayment,
    email:user?.email,
    otp:''
  };

  const handleCreateOrder = async (otp)=>{
    setLoading(true);
    try {
      const vertifyOrderData = ({...orderData,otp:otp})
      const orderResponse = await createOrder(accessToken,vertifyOrderData,axiosJWT);
      console.log(vertifyOrderData);
      console.log(orderResponse);
      if (orderResponse.success){
        if (orderData.payment_method !== 'vnpay') {
          setShowOtpInput(false);
          NotificationMessage.success(orderResponse.message);
          setIsSuccess(true);
          await sendInfoOrder(user?.email,orderResponse.order.order_id);
        } else {
          const paymentResponse = await createPaymentUrl(orderResponse?.order?.order_id);
          if (paymentResponse.success) {
            window.location.href = paymentResponse?.paymentUrl; // Chuyển hướng trực tiếp đến URL thanh toán
            console.log(`thông tin đơn  hàng ${orderResponse.order.order_id} được gửi vào email`, orderData.email)
          } else {
            NotificationMessage.error(paymentResponse.message || 'Lỗi khi tạo URL thanh toán');
          }
        }
    } else {
      NotificationMessage.error(orderResponse.message || 'Tạo đơn hàng không thành công');
    }
    } catch (error) {
      NotificationMessage.error('Lỗi khi tạo đơn hàng')
    }
  };

  return (
    <div>
        {isLoading && (
         <LoadingOverlay isLoading={isLoading}/>
        )}
        {!showOtpInput ? (
          <div className="checkout-container">
            <div className="checkout-header">
              <h1>Thanh Toán</h1>
              <p>Xác nhận đơn hàng của bạn</p>
            </div>
          
           {!isSuccess?(
                <div className="checkout-content">
                {/* Order Details */}
                <div className="order-details card">
                  <div className="card-header">
                    <h2>Chi Tiết Đơn Hàng</h2>
                  </div>
                  <div className="card-body">
                    {items.map(item => (
                      <div key={item.product._id} className="order-item">
                        <div className='item-img'>
                          <img alt={item.product.product_name} src={item.product?.images[0]?.url} />
                        </div>
                        <div className="item-info">
                          <h3>{item.product.product_name}</h3>
                          <p>Số lượng: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          <p className="total">{(item.product.price * item.quantity).toLocaleString()} VND</p>
                          <p className="unit-price">{item.product.price.toLocaleString()} VND/sp</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
        
                {/* Shipping and Payment */}
                <div className="checkout-sidebar">
                  {/* Shipping Information */}
                  <div className="info-user card">
                    <div className="card-header">
                      <h2>Thông Tin Giao Hàng</h2>
                      <div className='address-action'>
                          <Tag color='blue' type="primary" onClick={handleEditClick}>Thay đổi</Tag>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className='info-recipient'>  
                        <p>{shippingAddress?.recipient_name}</p>
                        <p>{shippingAddress?.phone_number}</p>
                      </div>
                      <div className='address-recipient'>
                        <p> {shippingAddress?.street}</p>
                        <p>{`${shippingAddress?.ward}, ${shippingAddress?.district}, ${shippingAddress?.province}`}</p>
                      </div>
                     
                    </div>
                  </div>
              
                  {/* Payment Summary */}
                  <div className="payment-summary card">
                    <div className="card-header">
                      <h2>Thông Tin Thanh Toán</h2>
                    </div>
                    <div className="card-body">
                      <div className="price-row">
                        <span>Tạm tính:</span>
                        <span>{totalPrice.toLocaleString()} VND</span>
                      </div>
                      <div className="price-row">
                        <span>Phí vận chuyển:</span>
                        <span>0 VND</span>
                      </div>
                      <div className="divider"></div>
                      <div className='payment-method price-row'>
                        <span>Phương thức Thanh toán:</span>
                        <div className='list-method'>
                        {paymentMethods.map((method) => (
                          <Tag.CheckableTag
                            key={method.key}
                            checked={selectedPayment === method.key}
                            onChange={() => handleSelectPayment(method.key)}
                            color={selectedPayment === method.key ? 'green' : 'blue'} // Thẻ chọn sẽ có màu xanh lá nếu được chọn, màu xanh dương nếu không chọn
                          >
                            {method.label}
                          </Tag.CheckableTag>
                        ))}
                        </div>
                      </div>
                      <div className="divider"></div>
                      <div className='price-row'>
                        <span>Voucher:</span>
                        <span>{selectedVoucher?.code}</span>
                        <div className='voucher-action'>
                          <Tag color='orange' type="primary" onClick={handleVoucherClick}>Chọn Voucher</Tag>
                        </div>
                      </div>
                      <div className='price-row'>
                        <span>Giảm giá:</span>
                        <span>{calculateDiscount().toLocaleString()} VND</span>
                      </div>
                      <div className="divider"></div>
                      <div className='price-row note' >
                        <span>Ghi chú:</span>
                        <div className='note-input'>
                          <Input 
                            style={{width:'100%', padding: 6}}
                            size='medium'
                          />
                        </div>
                      </div>
                      <div className="divider"></div>
                      <div className="price-row total">
                        <span>Tổng cộng:</span>
                        <span>{totalWithDiscount.toLocaleString()} VND</span>
                      </div>
                      <button 
                        className="checkout-button"
                        onClick={handleSentOTPSubmit} 
                        // onClick={handleCreateOrder} 
                      >
                        {loading ? <Loading3QuartersOutlined spin /> : 'Xác Nhận Đặt Hàng'}
                      </button>
                    </div>
                  
        
                  </div>
                </div>
              </div>  
          ):(
            <div className='checkout-content chekout-content-success'  >
               <Result
                  status="success"
                  title="Chúc Mừng Bạn Đã Đặt Hàng Thành công!"
                  subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                  extra={[
                    <Button 
                      type="primary" 
                      key="console"
                      onClick={() => window.location.href = '/'} // Chuyển về trang chủ
                    >
                      Quay về Trang Chủ
                    </Button>,
                    <Button 
                      key="buy" 
                      onClick={() => window.location.href = '/product'} // Tiếp tục mua hàng
                      >
                      Tiếp Tục Mua Hàng
                    </Button>,
                   ]}
                />
            </div>
          )}
    
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
                   onCancel={handleModalClose}
                   onApplyAddress={handleAddNewAddress}
                   updateAddressDefault={handelUpdateAddressDefault}
                />   
          </Modal>
    
           {/* Modal chọn voucher */}
           <Modal
            open={isVoucherModalOpen}
            onOk={handleVoucherModalClose}
            onCancel={handleVoucherModalClose}
            footer={null} 
            className='custom-modal'
          >
            <Voucher
                   VoucherData={voucherData}
                   selectedVoucher={selectedVoucher}
                   handleVoucherChange={handleVoucherChange}  // Cập nhật voucher tạm thời khi người dùng thay đổi
                   onCancel={handleCancel}
                   onApply={handleApply}
                />   
          </Modal>
            </div>
        ):(
          <div className='checkout-otp-container'>
            <div className="otp-confirm-container">
              <p className="otp-title">Mã xác nhận đã được gửi đến {} {loading ? <Loading3QuartersOutlined spin /> : ''}</p>
               <OtpInput length={6} onOtpSubmit={handleCreateOrder}/>
              <p className="otp-back">
                  <Link to="/login">Quay lại trang đăng nhập</Link>
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default CheckoutPage;
