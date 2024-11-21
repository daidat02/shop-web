import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Select, Input, Button, Breadcrumb, Dropdown, Menu ,Avatar} from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ExportOutlined, EllipsisOutlined,CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined,PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getTags } from '../../../../api/API_Product';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';
import { getCategories } from '../../../../api/API_Category';
import { getOrder } from '../../../../api/API_Order';

const { Option } = Select;

const AdminDiscount = () => {
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

  const mockVoucherData = [
    {
      _id: '672c47c2fa0b916aea8fa50c',
      code: 'DISCOUNT50',
      discount: 50,
      type: 'percentage',
      minOrderValue: 500000,
      validUntil: '2024-10-31T23:59:59.000Z',
      isActive: false,
    },
    {
      _id: '672c4a0a4046fb147eda003f',
      code: 'DISCOUNT10',
      discount: 10,
      type: 'percentage',
      minOrderValue: 500000,
      validUntil: '2024-10-31T23:59:59.000Z',
      isActive: false,
    },
    {
      _id: '672c4a164046fb147eda0042',
      code: 'DISCOUNT20',
      discount: 20,
      type: 'percentage',
      minOrderValue: 500000,
      validUntil: '2024-12-31T23:59:59.000Z',
      isActive: true,
    },
    {
      _id: '672c4a2d4046fb147eda0046',
      code: 'DISCOUNT15',
      discount: 15,
      type: 'percentage',
      minOrderValue: 500000,
      validUntil: '2024-12-31T23:59:59.000Z',
      isActive: true,
    },
    {
      _id: '672c569282ed1f50d6dbe269',
      code: 'DISCOUNT12/12',
      discount: 15,
      type: 'percentage',
      minOrderValue: 0,
      validUntil: '2024-12-31T23:59:59.000Z',
      isActive: true,
    },
  ];

  const fetchApi = async () => {
    try {
    
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
      title: '',
      render: (_, __, index) => `${index + 1}`,
      width: 20,
    },
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Giảm Giá',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      align: 'center',
      render: (type) => {
        const typeDisplay = {
          fixed: 'Fided',
          percentage: 'Percentage'
        };
    
        return (
          <Tag color="blue">
            {typeDisplay[type] || type}
          </Tag>
        );
      },
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Đơn Hàng Tối thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.minOrderValue - b.minOrderValue,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'state',
      width: 200,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      align: 'center',
    },
    {
      title: 'Ngày Hết Hạn',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 150,
      align: 'center',
      render: (validUntil) => new Date(validUntil).toLocaleDateString('en-GB'),
      sorter: (a, b) => new Date(a.validUntil) - new Date(b.validUntil),
    },
    {
      key: 'action',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="1">Chi tiết</Menu.Item>
            <Menu.Item key="2" icon={<DeleteOutlined style={{ color: 'red' }} />}>
              Hủy
            </Menu.Item>
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
        <Breadcrumb.Item>Discounts</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Discounts</h1>
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
            placeholder="Search Discounts"
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

          <Select defaultValue="Type" style={{ width: 120 }} onChange={handleTagChange}>
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ fontSize: 10 }}
          >
            Thêm Voucher
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <Table
          columns={columns}
          dataSource={mockVoucherData}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
};

export default AdminDiscount;
