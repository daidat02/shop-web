import React, { useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createProduct, getProductByCategory } from '../../../../api/API_Product';
import { uploadImages } from '../../../../api/API_Upload';
import NotificationMessage from '../../../Message/NotificationMessage';
import RichTextEditor from '../../Description/Description';

const CreateProduct = ({ categoryId }) => { 
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleUpload = async (file) => {
    try {
      const urls = await uploadImages(file);
      setImageUrls((prevUrls) => [...prevUrls, ...urls]);
      NotificationMessage.success('Upload ảnh thành công!');
    } catch (error) {
      NotificationMessage.error('Upload ảnh thất bại!');
    }
  };

  const onFinish = async (values) => {
    if (imageUrls.length === 0) {
      NotificationMessage.error('Ảnh chưa được tải lên!');
      return;
    }

    const productData = {
      ...values,
      category_id: categoryId,
      images: imageUrls.map(url => ({ url })),
    };

    try {
      const result = await createProduct(dispatch, categoryId, productData);
      if (result.success) {
        NotificationMessage.success('Tạo sản phẩm thành công!');
        form.resetFields();
        setFileList([]);
        setImageUrls([]);
        await getProductByCategory(dispatch, categoryId);
      } else {
        NotificationMessage.error('Tạo sản phẩm thất bại!');
      }
    } catch (error) {
      NotificationMessage.error('Lỗi khi tạo sản phẩm. Vui lòng thử lại.');
    }
  };

  return (
    <div className='create-form-container'>

    <div className='create-form'>
    <Form form={form} layout="vertical" onFinish={onFinish} >
        <div className='form-input'>
        <Form.Item name="product_id" label="Mã sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="product_name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Giới thiệu">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="brand" label="Nhãn hàng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', min: 0, message: 'Giá phải là số dương!' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="quantity" label="Kho" rules={[{ required: true, type: 'number', min: 0, message: 'Số lượng phải là số dương!' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="productType" label="Loại sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Tải ảnh lên">
          <Upload
            customRequest={({ file }) => handleUpload(file)}
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={(file) => {
              setFileList(fileList.filter(f => f.uid !== file.uid));
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
          
      </div>
      <RichTextEditor/>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
          Tạo sản phẩm
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>

  );
};

export default CreateProduct;
