import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Button, Breadcrumb, Dropdown, Menu ,Avatar} from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ExportOutlined, EllipsisOutlined,CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined,PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';
import { getCustomers } from '../../../../api/API_User';
import getAxiosInstance, { createAxiosInstance } from '../../../../createInstance';

const { Option } = Select;

const AdminCustomer = () => {
  const initialAccount = useSelector((state) => state.auth?.account);
  const msg = useSelector((state) => state.products.msg);
  const accessToken = initialAccount?.accessToken
  const dispatch = useDispatch()
  let axiosJWT = createAxiosInstance(initialAccount,dispatch); 
   const [customers,setCustomers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      const customersData = await getCustomers(accessToken,axiosJWT);
      setCustomers(customersData.data)
    } catch (error) {
      console.log("Không thể tải danh mục");
    }
  };

  // useEffect(() => {
  //   let newFilteredProducts = products;
  //   if (selectedCategory) {
  //     newFilteredProducts = newFilteredProducts.filter(
  //       (product) => product.category?._id === selectedCategory
  //     );
  //   }
  //   if (selectedTag) {
  //     newFilteredProducts = newFilteredProducts.filter((product) =>
  //       product.tags?.some((tag) => tag.tag._id === selectedTag)
  //     );
  //   }
  //   setFilteredProducts(newFilteredProducts);
  // }, [selectedCategory, selectedTag, products]);

  // const handleCategoryChange = (value) => {
  //   setSelectedCategory(value);
  // };

  // const handleTagChange = (value) => {
  //   setSelectedTag(value);
  // };

  const columns = [
    {
      title: '',
      render: (_, __, index) => `${index + 1}`,
      width: 20,
    },
    {
      title: 'Tên Khách Hàng',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 150,
      render: (user_name) => {
        const initials = user_name ? user_name.charAt(0).toUpperCase() : '';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar style={{ marginRight: 8 }}>
              {initials}
            </Avatar>
            <span>{user_name}</span>
          </div>
        );
      },
      sorter: (a, b) => a.user_name.localeCompare(b.user_name), // Sắp xếp theo tên người dùng
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.email.localeCompare(b.email), // Sắp xếp theo số điện thoại
    },
    {
        title: 'Địa CHỉ',
        dataIndex: ['address','province'],
        key: 'province',
        width: 120,
        align: 'center',
      },
    {
      title: 'Tổng Đơn',
      dataIndex: 'order_quantity',
      key: 'order_quantity',
      width: 60,
      align: 'center',
      sorter: (a, b) => a.order_quantity - b.order_quantity, // Sắp xếp theo tổng tiền
    },
    {
      title: 'Tổng Chi Tiêu',
      dataIndex: 'total_spent',
      key: 'total_spent',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.total_spent - b.total_spent, // Sắp xếp theo tổng tiền
      render: (amount) => amount.toLocaleString('vi-VN') + ' đ'

    },
   
    {
      title: 'Trạng Thái Tại Khoản',
      dataIndex: 'isAccount',
      key: 'isAccount',
      width: 120,
      align: 'center',
      render: (isAccount) => {
        const color = isAccount ? 'green' : 'red';
        const statusText = isAccount ? 'ACTIVE' : 'INACTIVE';
        return (
          <Tag color={color}>
            {statusText}
          </Tag>
        );
      },
      sorter: (a, b) => a.isAccount - b.isAccount, // Sắp xếp theo trạng thái tài khoản
    },
    {
      title: 'Đơn Hàng gần Nhất',
      dataIndex: 'last_order',
      key: 'last_order',
      width: 150,
      align: 'center',
      render: (last_order) => new Date(last_order).toLocaleDateString('en-GB') || '',
      sorter: (a, b) => new Date(a.last_order) - new Date(b.last_order), // Sắp xếp theo ngày tạo
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
        <Breadcrumb.Item><a>Trang Chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Khách Hàng</h1>
      </div>

      {/* <div className='list-state-product'>
        <ul>
          <li><a>All</a> (823)</li>
          <li><a>Pending</a>(780)</li>
          <li><a>Completed</a>(234)</li>
          <li><a>Canceled</a>(20)</li>
        </ul>
      </div> */}

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Tìm Khách Hàng"
            size="middle"
            style={{ width: 300, padding: '6px 10px' }}
          />
        </div>

        {/* <div className='btn-filters'>
          <Select defaultValue="Status" style={{ width: 120 }} >
              <Option value="1">Pendding</Option>
              <Option value="2">Shipped</Option>
              <Option value="3">Delivered</Option>
              <Option value="3">Canceled</Option>
          </Select>

          <Select defaultValue="Payment" style={{ width: 120 }}>
           
          </Select>

          <Select defaultValue="More filters" style={{ width: 120 }} onChange={() => {}}>
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
            <Option value="3">Option 3</Option>
          </Select>
        </div> */}

        <div className='btn-action'>
          {/* <Button className='btn-export' style={{ background: 'none' }}>
          <PrinterOutlined /> Export
          </Button> */}

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ fontSize: 10 }}
          >
            Thêm Khách Hàng
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <Table
          columns={columns}
          dataSource={customers}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
};

export default AdminCustomer;
