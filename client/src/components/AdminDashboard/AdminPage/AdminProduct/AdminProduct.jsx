import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Switch, Input, Button, Select, Breadcrumb } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import './product.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductByCategory } from '../../../../api/API_Product';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';

const { Option } = Select;
const { Search } = Input;

const AdminProduct = () => {
  const initialProducts = useSelector((state) => state.categories.products);
  const msg = useSelector((state) => state.products.msg);
  const dispatch = useDispatch();
  const { categoryId } = useParams(); // Lấy categoryId từ params
  const [products, setProducts] = useState(initialProducts);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    getProductByCategory(dispatch, categoryId);
  }, [dispatch, categoryId]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(dispatch, initialProducts._id, id);
      if (res.success === true) {
        NotificationMessage.success(msg.message); // Thông báo thành công
      }
      getProductByCategory(dispatch, categoryId);
    } catch (error) {
      NotificationMessage.error(error.response?.data || 'Có lỗi xảy ra');
    }
  };

  // Điều hướng đến trang tạo sản phẩm
  const handleCreateProduct = () => {
    navigate(`/admin/create-product/${categoryId}`); // Chuyển hướng sang trang tạo sản phẩm với categoryId
  };

  // Hàm xử lý khi nhấn vào Card
  const handleClick = (categoryId) => {
    navigate(`/admin/products/${categoryId}`);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const columns = [
    {
      title: 'TT',
      render: (_, __, index) => `${index + 1}`,
      width: 20,
    },
    {
      dataIndex: ['images', 0, 'url'],
      key: 'url',
      width: '55px',
      render: (url) => (
        <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: '2px', display: 'inline-block' }}>
          <img src={url} alt="Product" style={{ width: '50px', height: '50px' }} />
        </div>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: '300px',
      render: (product_name) => (
        <a>{product_name}</a>
      ),
      sorter: (a, b) => a.product_name.localeCompare(b.product_name), // Thêm sorter
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '100px',
      sorter: (a, b) => a.price - b.price, // Thêm sorter
    },
    {
      title: 'Category',
      dataIndex: 'productType',
      key: 'productType',
      width: '200px',
      sorter: (a, b) => a.productType.localeCompare(b.productType), // Thêm sorter
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '300px',
      render: () => (
        <span className="tag-container">
          <Tag color="green">New</Tag>
          <Tag color="blue">Popular</Tag>
          <Tag color="orange">Discount</Tag>
        </span>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
      sorter: (a, b) => a.quantity - b.quantity, // Thêm sorter
    },
    {
      title: 'State',
      dataIndex: 'tags',
      key: 'tags',
      width: '200px',
      render: () => (
        <span className="tag-container">
          <Tag color="green">Active</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleClick(record.category_id)}>Chi tiết </a>
          <DeleteOutlined
            style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
      width: '200px',
      align: 'center',
    },
  ];

  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Admin</a></Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

    <div className='title-container'>
     <h1 className='content-title'>Products</h1>
    </div>

      <div className='list-state-product'>
        <ul>
          <li><a>All</a> (78120)</li>
          <li><a>Published</a>(78120)</li>
          <li><a href="">Drafts</a>(18)</li>
          <li><a href="">On discount</a>(795)</li>
        </ul>
      </div>

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Search Products"
            size="middle"
            style={{
              width: 300,
              padding: '6px 10px',
            }}
          />
        </div>

        <div className='btn-filters'>
          <div className="filter-item">
            <Select
              defaultValue="Category"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </div>

          <div className="filter-item middle-item">
            <Select
              defaultValue="Vendor"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </div>

          <div className="filter-item">
            <Select
              defaultValue="More filters"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </div>
        </div>

        <div className='btn-action'>
          <Button className='btn-exprot' style={{ background: 'none' }}>
            <ExportOutlined /> Export
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProduct}
            style={{ fontSize: 10 }}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <div className='product-table'>
          <Table
            columns={columns}
            dataSource={products?.products}
            pagination={{ pageSize: 6 }} // Giới hạn số item hiển thị mỗi trang là 6
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
