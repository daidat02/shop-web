import React, { useState } from 'react';
import { Table, Tabs, Tag, Avatar, Button,message } from 'antd';
import { CheckCircleOutlined ,CloseCircleOutlined,SyncOutlined,ClockCircleOutlined} from '@ant-design/icons';
import { updateStatusOrder } from '../../../api/API_Order';

const TabOrder = ({orderData, updateOders}) => {
  const [activeTab, setActiveTab] = useState('all'); // Trạng thái tab mặc định
  
  // Bộ lọc đơn hàng theo trạng thái và sắp xếp theo ngày (mới nhất trước)
  const getFilteredOrders = (status) => {
    let filteredOrders = orderData;
    if (status !== 'all') {
      filteredOrders = orderData?.filter((order) => order.status === status);
    }
    return filteredOrders?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo ngày giảm dần
  };
  // Đếm số lượng đơn hàng theo trạng thái
  const getOrderCount = (status) => {
    if (status === 'all') return orderData?.length;
    return orderData?.filter((order) => order.status === status).length;
  };
  const handleConfirmDelivery = async(orderId)=>{
    const status = 'completed'
    try {
        const response = await updateStatusOrder(orderId,status);
        if(response.success == true){
            message.success(response.message)
        }else{
            message.error(response.message)
        }
    } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái");  // Thông báo lỗi nếu có lỗi trong quá trình xử lý
    }
  }
  const statusConfig = {
    pendding: { color: 'orange', icon: <ClockCircleOutlined  /> , value:'Chờ Xử Lý' },
    shipped: { color: 'blue', icon: <SyncOutlined spin /> , value:'Đã Vẫn Chuyển'},
    delivered: { color: 'green', icon: <CheckCircleOutlined /> ,value:'Đã Giao Hàng' },
    completed: { color: 'green', icon: <CheckCircleOutlined /> ,value:'Hoàn Thành'},
    canceled: { color: 'red', icon: <CloseCircleOutlined />,value:'Thất Bại'},
    paid:{ color: 'green', icon: <CheckCircleOutlined />, value:'Đã Thanh Toán'},
  };

  const columns = [
    {
      title: '',
      render: (_, __, index) => `${index + 1}`,
      width: 20,
    },
    {
      title: 'Đơn Hàng ',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.order_id.localeCompare(b.order_id),
      render: (order_id) => (
        <a href={`/order/${order_id}`}>
          #{order_id}
        </a>
      ),
    },
    {
      title: 'Người mua',
      dataIndex: 'user',
      key: 'user_name',
      width: 180,
      render: (user) => {
        const { user_name, avatar } = user || {};
        const initials = user_name ? user_name.charAt(0).toUpperCase() : '';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={avatar} style={{ marginRight: 8, background:'#ccc' }}>
              {!avatar && initials}
            </Avatar>
            <span>{user_name}</span>
          </div>
        );
      },
      sorter: (a, b) => a.user.user_name.localeCompare(b.user.user_name),
    },

   
    {
      title: 'Thanh Toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 120,
      align: 'payment_status',
      render: (payment_status) => {
        const { color, icon,value } = statusConfig[payment_status] || { color: 'default', icon: null };
        return (
          <Tag color={color}>
            {value} {icon}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status), // Sắp xếp theo trạng thái đơn hàng
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const { color, icon,value } = statusConfig[status] || { color: 'default', icon: null };
        return (
          <Tag color={color}>
            {value} {icon}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status), // Sắp xếp theo trạng thái đơn hàng
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: 'Tổng đơn',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.finalAmount - b.finalAmount,
      render: (price) => price.toLocaleString('vi-VN') + ' đ'
    },
    {
      key: 'action',
      render: (_, record) => {
        return (
          <Button
            onClick={()=>handleConfirmDelivery(record._id)}
            disabled={record.status !== 'delivered'} // Vô hiệu hóa nút nếu không phải trạng thái 'delivered'
            style={{
              backgroundColor: record.status === 'delivered' ? '#4a90e2' : '#ccc',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: record.status === 'delivered' ? 'pointer' : 'not-allowed',
            }}
          >
            Đã Nhận Hàng
          </Button>
        );
      },
      width: '150px', // Điều chỉnh kích thước nếu cần
      align: 'center',
    },
  ];
  

  return (
    <Tabs
      defaultActiveKey="all"
      onChange={setActiveTab}
      items={[
        {
          key: 'all',
          label: `Đơn Hàng (${getOrderCount('all')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('all')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
        {
          key: 'pending',
          label: `Chờ Xử lý (${getOrderCount('pendding')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('pendding')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
        {
          key: 'shipped',
          label: `Đã Vận Chuyển (${getOrderCount('shipped')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('shipped')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
        {
          key: 'delivered',
          label: `Đã Giao Hàng (${getOrderCount('delivered')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('delivered')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
        {
          key: 'completed',
          label: `Hoàn Thành (${getOrderCount('completed')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('completed')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
        {
          key: 'canceled',
          label: `Thất Bại (${getOrderCount('canceled')})`,
          children: (
            <Table
              columns={columns}
              dataSource={getFilteredOrders('canceled')}
              rowKey="order_id"
              pagination={{ pageSize: 5 }}
              className="custom-table" // Thêm lớp tùy chỉnh vào đây
            />
          ),
        },
      ]}
    />
  );
};

export default TabOrder;
