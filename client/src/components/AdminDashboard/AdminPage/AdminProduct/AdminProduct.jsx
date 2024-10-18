import React, { useEffect, useState } from 'react';
import { Space, Table, Tag,Switch, Input,Button } from 'antd';
import { DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import './product.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductByCategory } from '../../../../api/API_Product';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationMessage from '../../../Message/NotificationMessage';

const { Search } = Input;


const AdminProduct = () => {
  const initialProducts = useSelector((state) => state.categories.products);
  const msg = useSelector((state)=> state.products.msg);
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

  const columns = [
    {
      title: 'TT',
         render: (_, __, index) => `${index + 1}`,
        width: "20px"
    },
    {
      dataIndex: ['images', 0, 'url'], // Lấy URL của ảnh đầu tiên trong mảng images
      key: 'url',
      width: "10%",
      render: (url) => (
        <img src={url} alt="Product" style={{ width: '100%', height: 'auto' }} />
      ),
    },
    
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
      width: "20%"
    },
    {
      title: 'Phân Loại',
      dataIndex: 'productType',
      key: 'productType',
      width: "20%"
    },
    
    {
      title: 'Kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: "10x`%"
    },

    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      width: "10%"
    },
    
    // {
    //   title: 'Trạng Thái',
    //   key: 'state',
    //   dataIndex: 'state',
    //   render: (_, { state }) => (
    //     <>
    //       <Tag color={state === 'active' ? 'green' : 'red'}>
    //         {state === 'active' ? 'Active' : 'Inactive'}
    //       </Tag>
    //       <Switch 
    //         checked={state === 'active'}  
    //         onChange={onChange}           // Hàm xử lý khi chuyển đổi trạng thái
    //         style={{
    //           marginLeft: 8,                
    //         }}
    //       />
    //     </>
    //   ),
    //   align: 'center'
    // },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={()=> handleClick(record.category_id)}>Chi tiết </a>
          <DeleteOutlined 
            style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }} 
            onClick={() => handleDelete(record._id)} 
          />     
        </Space>
      ),
      width:"20%",
      align: 'center' // Căn giữa nội dung cột
  
    },
  ];

  return (
    <div className='content-container'>
      {/* <div className='btn-container'>
        <Button type="primary" onClick={handleCreateProduct}>
          Tạo sản phẩm
        </Button>
      </div> */}
      <div className='content-header' >
        <div className='admin-search'>
        <Search placeholder="Nhập thông tin tìm kiếm " enterButton="Tìm kiếm"   style={{ width: 350 }} />
        </div>
        <div className='create'>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProduct}
        >
          Create
        </Button>
        </div>
      </div>
      
      <div className='product-container'>
        <div className='category-table'>
          <Table columns={columns} dataSource={products?.products} />
        </div>


      </div>
    </div>
  );
};

export default AdminProduct;
