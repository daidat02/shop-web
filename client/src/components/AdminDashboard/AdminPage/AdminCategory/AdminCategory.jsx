import React, { useEffect } from 'react';
import { Space, Table, Tag,Switch, Input,Button } from 'antd';
import {DeleteOutlined ,PlusOutlined , EyeOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../../api/API_Category';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để điều hướng

const { Search } = Input;

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};



function AdminCategory() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    getCategories(dispatch);
  },[dispatch]);

  // Hàm xử lý khi nhấn vào Card
  const handleClick = (categoryId) => {
    navigate(`/admin/products/${categoryId}`);
  };

  const handleDelete = (id)=>{

  }
  
  const columns = [
    {
      title: 'STT',
         render: (_, __, index) => `#${index + 1}`,
        width: "20px"
    },
    {
      title: 'Tên Danh Mục',
      dataIndex: 'category_name',
      key: 'category_name',
      width: "50%"
    },
   
    {
      title: 'Trạng Thái',
      key: 'state',
      dataIndex: 'state',
      render: (_, { state }) => (
        <>
          <Tag color={state === 'active' ? 'green' : 'red'}>
            {state === 'active' ? 'Active' : 'Inactive'}
          </Tag>
          <Switch 
            checked={state === 'active'}  
            onChange={onChange}           // Hàm xử lý khi chuyển đổi trạng thái
            style={{
              marginLeft: 8,                
            }}
          />
        </>
      ),
      align: 'center'
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="default" 
            icon={<EyeOutlined />} 
            onClick={() => handleClick(record.category_id)}
            style={{ borderColor: 'gray', color: 'gray' }} 
            ghost
          >
          </Button>
          <Button 
            type="default" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)}
            style={{ borderColor: 'red', color: 'red' }}
            ghost
          >
          </Button>
        </Space>
      ),
      width: "20%",
      align: 'center'
    }
    
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <div className='content-header' >
        <div className='admin-search'>
        <Search placeholder="Nhập thông tin tìm kiếm " enterButton="Tìm kiếm"   style={{ width: 350 }} />
        </div>
        <div className='create'>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => console.log('Tạo mới')}
        >
          Create
        </Button>
        </div>
      </div>
      <div className='category-table'>
      <Table columns={columns} dataSource={categories} />
      </div>
    </div>
  );
}

export default AdminCategory;
