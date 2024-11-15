import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Select, Input, Button, Breadcrumb, Dropdown, Menu ,Avatar} from 'antd';
import { DeleteOutlined, SearchOutlined, EllipsisOutlined,CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined,PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getTags } from '../../../../api/API_Product';
import { useNavigate } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';
import { getCategories } from '../../../../api/API_Category';
import { getOrder } from '../../../../api/API_Order';

const { Option } = Select;

const AdminOrder = () => {
  const msg = useSelector((state) => state.products.msg);
  const dispatch = useDispatch();
  const [orders,SetOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const ordersData = await getOrder();
      SetOrders(ordersData);
      const productData = await getProducts();
      setProducts(productData);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      const tagData = await getTags();
      setTags(tagData.data);
    } catch (error) {
      console.log("Không thể tải danh mục");
    }
  };

  useEffect(() => {
    let newFilteredProducts = products;
    if (selectedCategory) {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.category?._id === selectedCategory
      );
    }
    if (selectedTag) {
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.tags?.some((tag) => tag.tag._id === selectedTag)
      );
    }
    setFilteredProducts(newFilteredProducts);
  }, [selectedCategory, selectedTag, products]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  const statusConfig = {
    pendding: { color: 'orange', icon: <ClockCircleOutlined /> },
    shipped: { color: 'blue', icon: <SyncOutlined spin /> },
    delivered: { color: 'green', icon: <CheckCircleOutlined /> },
    completed: { color: 'green', icon: <CheckCircleOutlined /> },
    canceled: { color: 'red', icon: <CloseCircleOutlined /> },
    paid:{ color: 'green', icon: <CheckCircleOutlined /> },
  };

  const columns = [
    {
      title: 'Order ID',
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
      title: 'Customer',
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
      sorter: (a, b) => a.user.user_name.localeCompare(b.user.user_name), // Sắp xếp theo tên người dùng
    },
    {
      title: 'Phone Number',
      dataIndex: ['user', 'phonenumber'],
      key: 'phonenumber',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.user.phonenumber.localeCompare(b.user.phonenumber), // Sắp xếp theo số điện thoại
    },
    {
      title: 'Total',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.finalAmount - b.finalAmount, // Sắp xếp theo tổng tiền
    },
    {
      title: 'Payment Status',
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
      sorter: (a, b) => a.payment_status.localeCompare(b.payment_status), // Sắp xếp theo phương thức thanh toán
    },
    {
      title: 'Payment Method',
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
      sorter: (a, b) => a.payment_method.localeCompare(b.payment_method), // Sắp xếp theo phương thức thanh toán
    },
    {
      title: 'Order Status',
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
      sorter: (a, b) => a.status.localeCompare(b.status), // Sắp xếp theo trạng thái đơn hàng
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (createdAt) => new Date(createdAt).toLocaleDateString('en-GB'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sắp xếp theo ngày tạo
    },
    {
      key: 'action',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="1">Chi tiết</Menu.Item>
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
        <Breadcrumb.Item><a>Admin</a></Breadcrumb.Item>
        <Breadcrumb.Item>Orders</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Orders</h1>
      </div>

      <div className='list-state-product'>
        <ul>
          <li><a>All</a> (823)</li>
          <li><a>Pending</a>(780)</li>
          <li><a>Completed</a>(234)</li>
          <li><a>Canceled</a>(20)</li>
        </ul>
      </div>

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Search Orders"
            size="middle"
            style={{ width: 300, padding: '6px 10px' }}
          />
        </div>

        <div className='btn-filters'>
          <Select defaultValue="Status" style={{ width: 120 }} >
              <Option value="1">Pendding</Option>
              <Option value="2">Shipped</Option>
              <Option value="3">Delivered</Option>
              <Option value="3">Canceled</Option>
          </Select>

          <Select defaultValue="Payment" style={{ width: 120 }} onChange={handleTagChange}>
            {tags.map((tag) => (
              <Option key={tag._id} value={tag._id}>{tag.tag}</Option>
            ))}
          </Select>

          <Select defaultValue="More filters" style={{ width: 120 }} onChange={() => {}}>
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
            <Option value="3">Option 3</Option>
          </Select>
        </div>

        <div className='btn-action'>
          <Button className='btn-export' style={{ background: 'none' }}>
          <PrinterOutlined /> Export
          </Button>

          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ fontSize: 10 }}
          >
            Add Order
          </Button> */}
        </div>
      </div>

      <div className='product-container'>
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};

export default AdminOrder;
