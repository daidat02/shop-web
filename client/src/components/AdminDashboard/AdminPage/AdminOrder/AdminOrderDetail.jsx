import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Button, Breadcrumb, Steps, message} from 'antd';
import {CheckCircleOutlined, SyncOutlined, ClockCircleOutlined,
        PrinterOutlined,UserOutlined,MailOutlined,PhoneOutlined,EnvironmentOutlined,
        CreditCardOutlined,MessageOutlined,GiftOutlined
    } from '@ant-design/icons';
import './order-detail.css'
import { getDetailOrder, updateStatusOrder } from '../../../../api/API_Order';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Option } = Select;

const AdminOrderDetail = () => {
  const initialAccount = useSelector((state) => state.auth?.account);
  const accessToken = initialAccount?.accessToken
  const { orderId } = useParams(); // Lấy orderId từ URL params
  const [order,setOrder] = useState([]);
  const [products,setProducts] =useState([]);
  const [selectedStatus,setSelectedStatus]= useState();
  useEffect(() => {
    fetchApi();
  }, []);

 
  const fetchApi = async () => {
    try {
        const orderData = await getDetailOrder(orderId);
        setOrder(orderData?.data)
        setProducts(orderData?.data?.items);
    } catch (error) {
      console.log("Không thể tải danh mục");
    }
  };
  
  const handleUpdateStatus = async(value)=>{
    try {
        const response = await updateStatusOrder(order?._id,value);
        if(response.success == true){
            fetchApi();
            message.success(response.message)
        }else{
            message.error(response.message)
        }
    } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái");  // Thông báo lỗi nếu có lỗi trong quá trình xử lý
    }
  }
  const columns = [
    {
      dataIndex: ['product', 'images'],
      key: 'image',
      width: '55px',
      render: (images) => (
        <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: '2px', display: 'inline-block' }}>
          <img src={images[0]?.url} alt="Product" style={{ width: '40px', height: '40px' }} />
        </div>
      ),
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: ['product', 'product_name'],
      key: 'product_name',
      render: (product_name) => (
        <a>{product_name}</a>
      ),
      width:350
    },
    {
      title: 'Giá',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (price) => `${formatCurrency(price)}`,
      align:'center',
      width:150,

    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align:'center',
      width:100,

    },
    {
      title: 'Tổng',
      key: 'total',
      render: (text, record) => `${formatCurrency(record.priceTotal)}`,
      width:150,
      align:'center',
    },
  ];

    // Chuyển đổi trạng thái đơn hàng thành trạng thái của từng bước trong `Steps`
    const getStepStatus = (step) => {
      switch (order?.status) {
        case 'pendding':
          return step === 0 ? 'process' : 'wait';
        case 'shipped':
          return step === 1 ? 'process' : step < 1 ? 'finish' : 'wait';
        case 'delivered':
          return step === 2 ? 'process' : step < 2 ? 'finish' : 'wait';
        case 'completed':
          return step === 3 ? 'finish' : step < 3 ? 'finish' : 'wait';
        case 'canceled':
          return 'error';
        default:
          return 'wait';
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Trang Chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>Đơn Hàng</Breadcrumb.Item>
        <Breadcrumb.Item>Đơn Hàng #{orderId}</Breadcrumb.Item>

      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Đơn Hàng #{orderId}</h1>
      </div>
      <div className='order-detail-container'>
        <div className='products-table-container'>
                <div className='order-steps'>
                <Steps
                    items={[
                        {
                        title: 'Xử Lý',
                        status: getStepStatus(0),
                        icon: <ClockCircleOutlined />,
                        },
                        {
                        title: 'Vận Chuyển',
                        status: getStepStatus(1),
                        icon: <SyncOutlined />,
                        },
                        {
                        title: 'Đã Giao',
                        status: getStepStatus(2),
                        icon: <EnvironmentOutlined />,
                        },
                        {
                        title: 'Hoàn Thành',
                        status: getStepStatus(3),
                        icon: <CheckCircleOutlined />,
                        },
                    ]}
                    />
                </div>
               <div className='products-table'>
                    <Table
                        columns={columns}
                        pagination={false}
                        dataSource={products}
                        className="custom-table" // Thêm lớp tùy chỉnh vào đây
                    />
                    <div className='footer-table'>
                        <span>Tổng Giá Sản Phẩm:</span>
                        <span>{formatCurrency(order?.totalBill)}</span>
                    </div>
               </div>
                <div className='customer-info'>
                    <div className='payment-detail details'>

                        <div className='detail-header'>
                            <h3>Chi Tiết Thanh Toán</h3>
                        </div>
                        <div className='detail-row'>
                                <div className='row-header'> 
                                <UserOutlined/> 
                                    <span className='detail-row-name'>Khách Hàng</span>
                                </div>
                                <span className='content-detail'>{order?.user?.user_name}</span>
                            </div>

                            <div className='detail-row'>
                                <div className='row-header'> 
                                    <MailOutlined />
                                    <span className='detail-row-name'>Email</span>
                                </div>
                                <span className='content-detail'>{order?.user?.email}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <PhoneOutlined />
                                    <span className='detail-row-name'>SDT</span>
                                </div>
                                <span className='content-detail'>{order?.user?.phonenumber}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                    <CreditCardOutlined />
                                    <span className='detail-row-name'>Phương Thức</span>
                                </div>
                                <Tag className='content-detail' color='blue'>{order?.payment_method}</Tag>
                            </div>
                     </div>

                    <div className='shipping-detail details'>
                    <div className='detail-header'>
                            <h3>Chi Tiết Vận Chuyển</h3>
                    </div>

                    <div className='detail-row'>
                                <div className='row-header'> 
                                <UserOutlined/> 
                                    <span className='detail-row-name'>Người Nhận</span>
                                </div>
                                <span className='content-detail'>{order?.shippingAddress?.recipient_name}</span>
                            </div>

                            <div className='detail-row'>
                                <div className='row-header'> 
                                    <MailOutlined />
                                    <span className='detail-row-name'>Email</span>
                                </div>
                                <span className='content-detail'>{order?.user?.email}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <PhoneOutlined />
                                    <span className='detail-row-name'>SDT</span>
                                </div>
                                <span className='content-detail'>{order?.user?.phonenumber}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <EnvironmentOutlined />
                                    <span className='detail-row-name'>Địa Chỉ</span>
                                </div>
                                <div className='address'>
                                  <span >{order?.shippingAddress?.street}</span>
                                  <span >{`${order?.shippingAddress?.ward}, ${order?.shippingAddress?.district}, ${order?.shippingAddress?.province}`}</span>
                                </div>
                            </div>

                    </div>

                    <div className='other-detail details'>
                         <div className='detail-header'>
                            <h3>Khác</h3>
                        </div>
                        <div className='detail-row'>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <GiftOutlined />
                                    <span className='detail-row-name'>Quà Tặng</span>
                                </div>
                                <span className='content-detail'>Yes</span>
                            </div>

                                <div className='row-header'> 
                                <MessageOutlined />
                                <span className='detail-row-name'>Ghi Chú</span>
                                </div>
                                <p className='content-detail'>Happy Birthday Shiniga Lots of Love Buga Buga!!</p>
                            </div>
                    </div>
                </div>
        </div>
        <div className='summary-container'>
            <div className='summary-content card'>
                <div className="card-header">
                  <h2>Chi Tiết</h2>
                </div>            
                <div className='card-body'>
                    <div className='price-row'>
                        <span>Tổng Sản Phẩm :</span>
                        <span>{formatCurrency(order?.totalBill)} </span>
                    </div>
                    <div className='price-row'>
                        <span>Khuyến Mãi :</span>
                        <span>{formatCurrency(order?.discountAmount)} </span>
                    </div>
                    <div className='price-row'>
                        <span>Phí Vận Chuyển  :</span>
                        <span>{formatCurrency(order?.shippingCost)} </span>
                    </div>

                    <div className='price-row'>
                        <span>Tổng :</span>
                        <span>{formatCurrency(order?.shippingCost+order?.totalBill - order?.discountAmount)}</span>
                    </div>
                    
                    <div className="divider"></div>
                    <div className='price-row total'>
                        <span >Tổng Đơn  :</span>
                        <span>{formatCurrency(order?.finalAmount)}</span>
                    </div>
                </div>
            </div>
            {initialAccount?.user.role === 'admin' && (
              <div className='order-status-container card'>
                  <div className="card-header">
                    <h2> Trạng Thái Đơn Hàng</h2>
                  </div>
                  <div className='card-body'>
                          <div className='order-action'>
                          <span>Cập Nhật Trạng Thái</span>
                          <Select 
                              value={order.status}
                              placeholder="Order Status"
                              onChange={(value) => handleUpdateStatus( value)}
                              >
                                  <Option value="pendding">Chờ Xử Lý</Option>
                                  <Option value="shipped">Đã Vẫn Chuyển</Option>
                                  <Option value="delivered">Đã Giao Hàng</Option>
                                  <Option value="completed">Hoàn Thành</Option>
                                  <Option value="canceled">Thất Bại</Option>
                          </Select>
                        </div>                    
                      <div className='order-action'>
                          <span>Trạng Thái Thanh Toán</span>
                          <Select 
                              value={order.payment_status}
                              placeholder="Order Status"
                              onChange={(value) =>console.log(value)}
                          >
                                  <Option value="pendding">Chờ Xử Lý</Option>
                                  <Option value="paid">Đã Thanh Toán</Option>
                                  <Option value="canceled">Thất Bại</Option>

                          </Select>
                      </div>
      
                  </div>
              </div>
            )}
        </div>
     
      </div>
    </div>
  );
};

export default AdminOrderDetail;
