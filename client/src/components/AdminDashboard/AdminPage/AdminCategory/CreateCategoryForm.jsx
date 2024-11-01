import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createCategory, getCategories } from '../../../../api/API_Category';
import { uploadImages } from '../../../../api/API_Upload';

const CreateCategoryForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // Danh sách file đã upload
  const [imageUrls, setImageUrls] = useState([]); // Danh sách URL hình ảnh

  // Hàm upload hình ảnh
  const handleUpload = async (file) => {
    try {
      const urls = await uploadImages(file);
      setImageUrls((prevUrls) => [...prevUrls, ...urls]); // Thêm các URL đã upload vào danh sách
      message.success('Upload ảnh thành công!');
    } catch (error) {
      message.error('Upload ảnh thất bại!');
    }
  };

  const onFinish = async (values) => {

    if (imageUrls.length === 0) {
      message.error('Ảnh chưa được tải lên!!!');
      return; // Dừng quá trình nếu chưa có ảnh
    }
  
    console.log('Form data:', values);
    
    // Đảm bảo imageUrls được cập nhật trước khi tạo danh mục
    const categoryData = {
      ...values,
      images: imageUrls.map(url => ({ url })) // Thêm URL hình ảnh vào dữ liệu danh mục
    };

    try {
      
      const result = await createCategory(dispatch, categoryData);

      if (result.success) {
        message.success('Tạo danh mục thành công!');
        form.resetFields(); // Reset form
        setFileList([]); // Xóa danh sách file đã upload
        setImageUrls([]); // Xóa danh sách URL hình ảnh
      } else {
        message.error('Tạo danh mục thất bại!', result.error);
      }
    } catch (error) {
      message.error('Lỗi khi tạo danh mục!');
    }
  };

  return (
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
            handleUpload(file); // Gọi hàm handleUpload cho từng file
            setFileList([...fileList, file]); // Cập nhật danh sách file đã upload
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
  );
};

export default CreateCategoryForm;
