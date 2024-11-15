import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Button, Breadcrumb, Steps, message} from 'antd';
import {CheckCircleOutlined, SyncOutlined, ClockCircleOutlined,
        PrinterOutlined,UserOutlined,MailOutlined,PhoneOutlined,EnvironmentOutlined,
        CreditCardOutlined,MessageOutlined,GiftOutlined
    } from '@ant-design/icons';
import './order-detail.css'
import { getDetailOrder, updateStatusOrder } from '../../../../api/API_Order';
import { useParams } from 'react-router-dom';
const { Option } = Select;

const AdminOrderDetail = () => {


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
      title: 'Product Name',
      dataIndex: ['product', 'product_name'],
      key: 'product_name',
      render: (product_name) => (
        <a>{product_name}</a>
      ),
      width:350
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (price) => `${price} VND`,
      align:'center',
      width:150,

    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align:'center',
      width:100,

    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => `${record.priceTotal} VND`,
      width:150,
      align:'center'
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

  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Admin</a></Breadcrumb.Item>
        <Breadcrumb.Item>Orders</Breadcrumb.Item>
        <Breadcrumb.Item>Order #353432</Breadcrumb.Item>

      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Order #{orderId}</h1>
      </div>
      <div className='order-detail-container'>
        <div className='products-table-container'>
                <div className='order-steps'>
                <Steps
                    items={[
                        {
                        title: 'Pendding',
                        status: getStepStatus(0),
                        icon: <ClockCircleOutlined />,
                        },
                        {
                        title: 'Shipped',
                        status: getStepStatus(1),
                        icon: <SyncOutlined />,
                        },
                        {
                        title: 'Delivered',
                        status: getStepStatus(2),
                        icon: <EnvironmentOutlined />,
                        },
                        {
                        title: 'Completed',
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
                        <span>Items subtotal:</span>
                        <span>{order?.totalBill} VND</span>
                    </div>
               </div>
                <div className='customer-info'>
                    <div className='payment-detail details'>

                        <div className='detail-header'>
                            <h3>Payment details</h3>
                        </div>
                        <div className='detail-row'>
                                <div className='row-header'> 
                                <UserOutlined/> 
                                    <span className='detail-row-name'>Customer</span>
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
                                    <span className='detail-row-name'>Phone</span>
                                </div>
                                <span className='content-detail'>{order?.user?.phonenumber}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                    <CreditCardOutlined />
                                    <span className='detail-row-name'>Payment Method</span>
                                </div>
                                <Tag className='content-detail' color='blue'>{order?.payment_method}</Tag>
                            </div>
                     </div>

                    <div className='shipping-detail details'>
                    <div className='detail-header'>
                            <h3>Shipping details</h3>
                    </div>

                    <div className='detail-row'>
                                <div className='row-header'> 
                                <UserOutlined/> 
                                    <span className='detail-row-name'>Recipient</span>
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
                                    <span className='detail-row-name'>Phone</span>
                                </div>
                                <span className='content-detail'>{order?.user?.phonenumber}</span>
                            </div>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <EnvironmentOutlined />
                                    <span className='detail-row-name'>Address</span>
                                </div>
                                <div className='address'>
                                  <span >{order?.shippingAddress?.street}</span>
                                  <span >{`${order?.shippingAddress?.ward}, ${order?.shippingAddress?.district}, ${order?.shippingAddress?.province}`}</span>
                                </div>
                            </div>

                    </div>

                    <div className='other-detail details'>
                         <div className='detail-header'>
                            <h3>Other details</h3>
                        </div>
                        <div className='detail-row'>
                            <div className='detail-row'>
                                <div className='row-header'> 
                                     <GiftOutlined />
                                    <span className='detail-row-name'>Gift order</span>
                                </div>
                                <span className='content-detail'>Yes</span>
                            </div>

                                <div className='row-header'> 
                                <MessageOutlined />
                                <span className='detail-row-name'>Message</span>
                                </div>
                                <p className='content-detail'>Happy Birthday Shiniga Lots of Love Buga Buga!!</p>
                            </div>
                    </div>
                </div>
        </div>
        <div className='summary-container'>
            <div className='summary-content card'>
                <div className="card-header">
                  <h2>Sumary</h2>
                </div>            
                <div className='card-body'>
                    <div className='price-row'>
                        <span>Items subtotal :</span>
                        <span>{order?.totalBill} VND</span>
                    </div>
                    <div className='price-row'>
                        <span>Discount :</span>
                        <span>{order?.discountAmount} VND</span>
                    </div>
                    <div className='price-row'>
                        <span>Shipping Cost  :</span>
                        <span>{order?.shippingCost} VND</span>
                    </div>

                    <div className='price-row'>
                        <span>Subtotal :</span>
                        <span>{order?.shippingCost+order?.totalBill - order?.discountAmount} VND</span>
                    </div>
                    
                    <div className="divider"></div>
                    <div className='price-row total'>
                        <span >Total  :</span>
                        <span>{order?.finalAmount} VND</span>
                    </div>
                </div>
            </div>
            <div className='order-status-container card'>
                <div className="card-header">
                  <h2> Order Status</h2>
                </div>
                <div className='card-body'>
                    <div className='order-action'>
                        <span>Order Status</span>
                        <Select 
                            value={order.status}
                            placeholder="Order Status"
                            onChange={(value) => handleUpdateStatus( value)}
                            >
                                <Option value="pendding">Pendding</Option>
                                <Option value="shipped">Shipped</Option>
                                <Option value="delivered">Delivered</Option>
                                <Option value="completed">Completed</Option>
                                <Option value="canceled">Canceled</Option>
                        </Select>
                    </div>
                    <div className='order-action'>
                        <span>Payment Status</span>
                        <Select 
                            value={order.payment_status}
                            placeholder="Order Status"
                            onChange={(value) =>console.log(value)}
                        >
                                <Option value="pendding">Pendding</Option>
                                <Option value="paid">Paid</Option>
                        </Select>
                    </div>
    
                </div>
            </div>
        </div>
     
      </div>
    </div>
  );
};

export default AdminOrderDetail;
