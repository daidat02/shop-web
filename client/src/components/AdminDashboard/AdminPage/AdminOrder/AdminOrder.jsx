import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Select, Input, Button, Breadcrumb, Dropdown, Menu, Avatar, DatePicker } from 'antd';
import { DeleteOutlined, SearchOutlined, EllipsisOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getTags } from '../../../../api/API_Product';
import { useNavigate } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';
import { getCategories } from '../../../../api/API_Category';
import { getOrder } from '../../../../api/API_Order';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminOrder = () => {
  const msg = useSelector((state) => state.products.msg);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const ordersData = await getOrder();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.log("Không thể tải đơn hàng");
    }
  };

  // Hàm xử lý tìm kiếm và lọc
  useEffect(() => {
    let result = orders;

    // Tìm kiếm theo từ khóa
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter((order) => {
        return (
          order.order_id.toLowerCase().includes(keyword) ||
          order.user.user_name.toLowerCase().includes(keyword) ||
          order.user.phonenumber.includes(keyword)
        );
      });
    }

    // Lọc theo trạng thái đơn hàng
    if (selectedStatus) {
      result = result.filter((order) => order.status === selectedStatus);
    }

    // Lọc theo trạng thái thanh toán
    if (selectedPaymentStatus) {
      result = result.filter((order) => order.payment_status === selectedPaymentStatus);
    }

    // Lọc theo khoảng ngày
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    // Luôn sắp xếp kết quả theo ngày mới nhất
    result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredOrders(result);
  }, [searchKeyword, selectedStatus, selectedPaymentStatus, dateRange, orders]);

  // Xử lý thống kê số lượng đơn hàng theo trạng thái
  const orderStats = {
    all: filteredOrders.length,
    pending: filteredOrders.filter(order => order.status === 'pendding').length,
    completed: filteredOrders.filter(order => order.status === 'completed').length,
    canceled: filteredOrders.filter(order => order.status === 'canceled').length
  };

  const statusConfig = {
    pendding: { color: 'orange', icon: <ClockCircleOutlined /> },
    shipped: { color: 'blue', icon: <SyncOutlined spin /> },
    delivered: { color: 'green', icon: <CheckCircleOutlined /> },
    completed: { color: 'green', icon: <CheckCircleOutlined /> },
    canceled: { color: 'red', icon: <CloseCircleOutlined /> },
    paid: { color: 'green', icon: <CheckCircleOutlined /> },
  };
  const handleNavigate =(path)=>{
    navigate(path)
  }
  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.order_id.localeCompare(b.order_id),
      render: (order_id) => (
        <a href={`/admin/order/order-detail/${order_id}`}>
          #{order_id}
        </a>
      ),
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'user',
      key: 'user_name',
      width: 180,
      render: (user) => {
        const { user_name, avatar } = user || {};
        const initials = user_name ? user_name.charAt(0).toUpperCase() : '';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={avatar} style={{ marginRight: 8 }}>
              {!avatar && initials}
            </Avatar>
            <span>{user_name}</span>
          </div>
        );
      },
      sorter: (a, b) => a.user.user_name.localeCompare(b.user.user_name),
    },
    {
      title: 'SDT',
      dataIndex: ['user', 'phonenumber'],
      key: 'phonenumber',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.user.phonenumber.localeCompare(b.user.phonenumber),
    },
    {
      title: 'Tổng Đơn',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.finalAmount - b.finalAmount,
      render: (amount) => amount.toLocaleString('vi-VN') + ' đ'
    },
    {
      title: 'Trạng Thái Thanh Toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 120,
      align: 'center',
      render: (payment_status) => {
        const { color, icon } = statusConfig[payment_status] || { color: 'default', icon: null };
        return (
          <Tag color={color}>
            {payment_status.toUpperCase()} {icon}
          </Tag>
        );
      },
      sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
    },
    {
      title: 'Phương Thức',
      dataIndex: 'payment_method',
      key: 'payment_method',
      width: 120,
      align: 'center',
      render: (payment_method) => {
        const paymentDisplay = {
          cash_on_delivery: 'Cash on Delivery',
          vnpay: 'VNPay'
        };
        return (
          <Tag color="blue">
            {paymentDisplay[payment_method] || payment_method}
          </Tag>
        );
      },
      sorter: (a, b) => a.payment_method.localeCompare(b.payment_method),
    },
    {
      title: 'Trạng Thái Đơn Hàng',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const { color, icon } = statusConfig[status] || { color: 'default', icon: null };
        return (
          <Tag color={color}>
            {status.toUpperCase()} {icon}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      key: 'action',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="1" onClick={()=> handleNavigate(`/admin/order/order-detail/${record.order_id}`)}>Chi tiết</Menu.Item>
            <Menu.Item key="2" icon={<DeleteOutlined style={{ color: 'red' }} />}>Hủy</Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Dropdown>
        );
      },
      width: '50px',
      align: 'center',
    },
  ];

  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Trang Chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>Đơn Hàng</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Orders</h1>
      </div>

      <div className='list-state-product'>
        <ul>
          <li><a>Tất Cả</a> ({orderStats.all})</li>
          <li><a>Chờ Xử Lý</a>({orderStats.pending})</li>
          <li><a>Hoàn Thành</a>({orderStats.completed})</li>
          <li><a>Thất Bại</a>({orderStats.canceled})</li>
        </ul>
      </div>

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Tìm theo mã đơn, tên KH, SĐT"
            size="middle"
            style={{ width: 300, padding: '6px 10px' }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>

        <div className='btn-filters'>
          <Select
            defaultValue="Trạng Thái Đơn"
            style={{ width: 150 }}
            onChange={(value) => setSelectedStatus(value)}
            allowClear
          >
            <Option value="pendding">Chờ Xử Lý</Option>
            <Option value="shipped">Đã Vận Chuyển</Option>
            <Option value="delivered">Đã Giao Hàng</Option>
            <Option value="completed">Hoàn Thành</Option>
            <Option value="canceled">Thất Bại</Option>
          </Select>

          <Select
            defaultValue="Thanh Toán"
            style={{ width: 150 }}
            onChange={(value) => setSelectedPaymentStatus(value)}
            allowClear
          >
            <Option value="paid">Đã Thanh Toán</Option>
            <Option value="pendding">Chưa Thanh Toán</Option>
            <Option value="canceled">Đã Hủy</Option>
          </Select>

          <RangePicker
            style={{ width: 250, background:'none',border:'none' }}
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
              } else {
                setDateRange(null);
              }
            }}
          />
        </div>

        <div className='btn-action'>
          <Button className='btn-export' style={{ background: 'none' }}>
            <PrinterOutlined /> Xuất
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};

export default AdminOrder;