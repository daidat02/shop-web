import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Switch, Input, Button, Select, Breadcrumb, Drawer, Form, message, Upload, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ExportOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getCategories, createCategory, deleteCategory } from '../../../../api/API_Category';
import { uploadImages } from '../../../../api/API_Upload';
import { useNavigate } from 'react-router-dom';
import CreateCategoryForm from './CreateCategoryForm';

const { Search } = Input;
const { Option } = Select;

function AdminCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]); // Danh sách file đã upload
  const [imageUrls, setImageUrls] = useState([]); // Danh sách URL hình ảnh
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.log("Không thể tải danh mục");
    }
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/admin/products/${categoryId}`);
  };

  const handleUpload = async (file) => {
    try {
      const urls = await uploadImages(file);
      setImageUrls((prevUrls) => [...prevUrls, ...urls]);
      message.success('Upload ảnh thành công!');
    } catch (error) {
      message.error('Upload ảnh thất bại!');
    }
  };

  const onFinish = async (values) => {
    if (imageUrls.length === 0) {
      message.error('Ảnh chưa được tải lên!!!');
      return;
    }
  
    const categoryData = {
      ...values,
      images: imageUrls.map(url => ({ url }))
    };

    try {
      const result = await createCategory(dispatch, categoryData);

      if (result.success) {
        message.success('Tạo danh mục thành công!');
        form.resetFields();
        setFileList([]);
        setImageUrls([]);
        fetchCategories();
      } else {
        message.error('Tạo danh mục thất bại!', result.error);
      }
    } catch (error) {
      message.error('Lỗi khi tạo danh mục!');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa danh mục này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success('Xóa danh mục thành công!');
          fetchCategories();
        } catch (error) {
          message.error('Không thể xóa danh mục');
        }
      },
    });
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
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
      title: 'Tên Danh Mục',
      dataIndex: 'category_name',
      key: 'category_name',
      width: '300px',
      render: (category_name) => <a>{category_name}</a>,
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'state',
      key: 'state',
      width: '200px',
      render: (state) => (
        <span className="tag-container">
          <Tag color={state === 'active' ? 'green' : 'red'}>
            {state === 'active' ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
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
        <Breadcrumb.Item><a>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>Danh Mục</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Danh Mục</h1>
      </div>

      <div className='action-nav'>
        <div className='admin-search'>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
            placeholder="Tìm danh mục "
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
              defaultValue="Danh Mục"
              style={{ width: 120 }}
            >
              {categories?.map((category) => (
                <Option key={category._id} value={category._id}>{category.category_name}</Option>
              ))}
            </Select>
          </div>
        </div>

        <div className='btn-action'>


          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showDrawer}
            style={{ fontSize: 10 }}
          >
            Thêm Danh Mục
          </Button>
        </div>
      </div>

      <div className='product-container'>
        <div className='product-table'>
          <Table
            columns={columns}
            dataSource={categories}
            pagination={{ pageSize: 6 }}
          />
        </div>
      </div>

      <Drawer
        title="Thêm Danh Mục"
        width={420}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Mã Danh Mục"
            name="category_id"
            rules={[{ required: true, message: 'Hãy nhập mã danh mục!' }]}
          >
            <Input placeholder="Nhập mã danh mục" />
          </Form.Item>

          <Form.Item
            label="Tên Danh Mục"
            name="category_name"
            rules={[{ required: true, message: 'Hãy nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item label="Tải ảnh">
            <Upload
              customRequest={({ file }) => {
                handleUpload(file);
                setFileList([...fileList, file]);
              }}
              listType="picture"
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo Danh Mục
            </Button>
          </Form.Item>
        </Form>     
      </Drawer>
    </div>
  );
}

export default AdminCategory;
