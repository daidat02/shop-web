import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Select, Input, Button, Breadcrumb, Dropdown, Menu } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ExportOutlined, EllipsisOutlined } from '@ant-design/icons';
import './product.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductByCategory, getProducts, getTags, removeProduct } from '../../../../api/API_Product';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';
import { getCategories } from '../../../../api/API_Category';

const { Option } = Select;

const AdminProduct = () => {
  const msg = useSelector((state) => state.products.msg);
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
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
    
    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword) {
      newFilteredProducts = newFilteredProducts.filter((product) => {
        const searchStr = searchKeyword.toLowerCase();
        return (
          product.product_name.toLowerCase().includes(searchStr) ||
          product.category?.category_name.toLowerCase().includes(searchStr) ||
          product.tags?.some(tag => tag.tag.tag.toLowerCase().includes(searchStr)) ||
          product.price.toString().includes(searchStr)
        );
      });
    }

    // Lọc theo danh mục
    if (selectedCategory) {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    // Lọc theo thẻ
    if (selectedTag) {
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.tags?.some((tag) => tag.tag._id === selectedTag)
      );
    }

    setFilteredProducts(newFilteredProducts);
  }, [selectedCategory, selectedTag, products, searchKeyword]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(dispatch, id);
      if (res.success === true) {
        NotificationMessage.success(msg.message);
        fetchApi();
      }
    } catch (error) {
      NotificationMessage.error(error.response?.data || 'Có lỗi xảy ra');
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeProduct(dispatch, id);
      if (res.success === true) {
        NotificationMessage.success(msg.message);
        fetchApi();
      }
    } catch (error) {
      NotificationMessage.error(error.response?.data || 'Có lỗi xảy ra');
    }
  };

  const handleCreateProduct = () => {
    navigate(`/admin/create-product/${categoryId}`);
  };

  const handleClick = (categoryId) => {
    navigate(`/admin/products/${categoryId}`);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
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
      title: 'Tên',
      dataIndex: 'product_name',
      key: 'product_name',
      width: '300px',
      render: (product_name) => (
        <a>{product_name}</a>
      ),
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Đơn Giá',
      dataIndex: 'price',
      key: 'price',
      width: '150px',
      sorter: (a, b) => a.price - b.price,
      render: (price) => price.toLocaleString('vi-VN') + ' đ'

    },
    {
      title: 'Danh Mục',
      dataIndex: ['category', 'category_name'],
      key: 'category_name',
      width: '200px',
      sorter: (a, b) => a.productType.localeCompare(b.productType),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: '300px',
      render: (tags) => (
        <span className="tag-container">
          {tags.map((tag) => (
            <Tag key={tag.tag._id} color="blue">{tag.tag.tag}</Tag> 
          ))}
        </span>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
      sorter: (a, b) => a.quantity - b.quantity,
      align:'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      key: 'state',
      width: '200px',
      render: (state) => (
        <Tag color={state === 'active' ? 'green' : 'red'}>
          {state === 'active' ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      align:'center'
    },
    {
      key: '',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="1"
              onClick={() => handleClick(record.category_id)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => handleDelete(record._id)}
            >
              Ngừng bán
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              onClick={() => handleRemove(record._id)}
            >
              Xóa
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Dropdown>
        );
      },
      width: '70px',
      align: 'center',
    },
  ];

  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Trang Chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>Sản Phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Sản Phẩm</h1>
      </div>

      <div className='list-state-product'>
        <ul>
          <li><a>Tất cả</a> ({filteredProducts.length})</li>
          <li><a>Hoạt Động</a>({filteredProducts.filter(p => p.state === 'active').length})</li>
          <li><a>Ngừng Bán</a>({filteredProducts.filter(p => p.state !== 'active').length})</li>
        </ul>
      </div>

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Tìm sản phẩm"
            size="middle"
            style={{ width: 300, padding: '6px 10px' }}
            onChange={handleSearch}
            value={searchKeyword}
            allowClear
          />
        </div>

        <div className='btn-filters'>
          <Select 
            defaultValue="Danh Mục" 
            style={{ width: 120 }} 
            onChange={handleCategoryChange}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>{category.category_name}</Option>
            ))}
          </Select>

          <Select 
            defaultValue="Thẻ" 
            style={{ width: 120 }} 
            onChange={handleTagChange}
            allowClear
          >
            {tags.map((tag) => (
              <Option key={tag._id} value={tag._id}>{tag.tag}</Option>
            ))}
          </Select>

          <Select defaultValue="Bộ Siêu Tập" style={{ width: 120 }} onChange={() => {}}>
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
            <Option value="3">Option 3</Option>
          </Select>
        </div>

        <div className='btn-action'>
          <Button className='btn-export' style={{ background: 'none' }}>
            <ExportOutlined /> Export
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProduct}
            style={{ fontSize: 10 }}
          >
            Thêm Sản Phẩm
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
};

export default AdminProduct;