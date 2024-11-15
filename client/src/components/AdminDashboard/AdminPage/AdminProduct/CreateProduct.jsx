import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Breadcrumb, Select, message } from 'antd';
import { PlusOutlined, ClearOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createProduct, getTags, getVariants } from '../../../../api/API_Product';
import {uploadImages} from '../../../../api/API_Upload'
import NotificationMessage from '../../../Message/NotificationMessage';
import RichTextEditor from '../../Description/Description';
import { getCategories } from '../../../../api/API_Category';
import { getBrand } from '../../../../api/API_Brand';

const { Dragger } = Upload;
const { Option } = Select;

const CreateProduct = ({ categoryId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [variants, setVariants] = useState([]);
  const [brands,setBrands] = useState([])
  const [availableOptions, setAvailableOptions] = useState([]);
  const [productData, setProductData] = useState({
    product_name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    productType:'',
    brand: '',
    collection: '',
    tags: [],
  });
  useEffect(() => {
    const fetchApi= async () => {
        try {
            const categoriesdata = await getCategories(); // Gọi hàm getCategories
            setCategories(categoriesdata); // Lưu danh mục vào state
            const tagData = await getTags();
            setTags(tagData.data);
            const variantsData = await getVariants();
            setAvailableOptions(variantsData.data)
            const brandData = await getBrand();
            setBrands(brandData);
        } catch (error) {
            console.log("Không thể tải danh mục"); // Thiết lập thông báo lỗi nếu có
        }
    };
    fetchApi();
}, []);

const handleUpload = async (file) => {
  try {
    const urls = await uploadImages(file); // Gọi API upload ảnh
    setImageUrls((prevUrls) => [...prevUrls, ...urls]); // Lưu URL ảnh
    NotificationMessage.success('Upload ảnh thành công!');
  } catch (error) {
    NotificationMessage.error('Upload ảnh thất bại!');
  }
};

const uploadProps = {
  fileList,
  beforeUpload: (file) => {
    handleUpload(file); // Sử dụng hàm upload ảnh
    return false; // Ngăn chặn Ant Design tự động upload
  },
  onRemove: (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList); // Cập nhật lại danh sách file sau khi xóa
  },
  onChange(info) {
    setFileList(info.fileList); // Cập nhật danh sách file khi có thay đổi
  },
};

const onFinish = async () => {
  if (imageUrls.length === 0) {
    NotificationMessage.error('Ảnh chưa được tải lên!');
    return;
  }

  const productDataToSubmit = {
    ...productData,
    images: imageUrls.map(url => ({ url })),
    tags: productData.tags.map(tag => ({ tag })),
  };

  try {
    const result = await createProduct(dispatch, productDataToSubmit);
    if (result.success) {
      NotificationMessage.success('Tạo sản phẩm thành công!');
      form.resetFields();
      
      // Resetting state values
      setFileList([]);
      setImageUrls([]);
      setProductData({
        product_name: '',
        description: '',
        price: '',
        salePrice: '',
        quantity: '',
        category: '',
        productType: '',
        brand: '',
        collection: '',
        tags: [],
      });
      setVariants([]);
      setAvailableOptions([]);
      
    } else {
      NotificationMessage.error('Tạo sản phẩm thất bại!');
    }
  } catch (error) {
    NotificationMessage.error('Lỗi khi tạo sản phẩm. Vui lòng thử lại.');
  }
};

  // Hàm để thêm Option mới
  const handleAddVariant = () => {
    const newVariant = {
      id: variants.length + 1, // Tạo id mới
      name: `Option ${variants.length + 1}`, // Tên Option mới
      type: '', // Loại Option (size, color, v.v.)
      selectedOption: null, // Tùy chọn đã chọn
    };
    setVariants([...variants, newVariant]); // Cập nhật danh sách
  };

  const handleVariantChange = (index, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index].type = value;
    updatedVariants[index].selectedOption = null; // Reset tùy chọn đã chọn khi loại thay đổi
    setVariants(updatedVariants);
  };

  const handleOptionChange = (index, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index].selectedOption = value; // Lưu tùy chọn đã chọn
    setVariants(updatedVariants);
  };

  const handleInputChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  
  return (
    <div className='content-container'>
      <Breadcrumb style={{ margin: '25px 50px' }}>
        <Breadcrumb.Item><a>Products</a></Breadcrumb.Item>
        <Breadcrumb.Item>Add product</Breadcrumb.Item>
      </Breadcrumb>

      <div className='title-container'>
        <h1 className='content-title'>Add a product</h1>
        <div className='btn-action'>
          <Button className='btn-exprot' style={{ background: 'none' }}>
            <ClearOutlined /> Discard
          </Button>

          <Button
            className='btn-create'
            type="primary"
            icon={<PlusOutlined />}
            style={{ fontSize: 13 }}
            onClick={onFinish} // Gọi hàm onFinish khi bấm nút
          >
            Publish product
          </Button>
        </div>
      </div>

      <div className='create-container'>
        <div className='create-form'>
          <h3 className='input-title'>Product Title</h3>
          <Input style={{ padding: '7px 0' }} 
            onChange={(e) => handleInputChange('product_name', e.target.value)} 
          />
          <h3 className='input-title'>Product Description</h3>
          <RichTextEditor 
            onChange={(value) => handleInputChange('description', value)} 
          />

          <h3 className='input-title'>Display Images</h3>
          <div className='upload-container'>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
              </p>
            </Dragger>
          </div>
          <h3 className='input-title'>Inventory</h3>
          <div className='pricing-container'>
            <span>Pricing</span>
            <div className='pricing-content'>
              <div>
                <h4 className='input-title'>Regular price</h4>
                <Input placeholder='$$$' style={{ width: 200, padding: '8px 5px', margin: 0 }} 
                  onChange={(e) => handleInputChange('price', e.target.value)} 
                />
              </div>
              <div>
                <h4 className='input-title'>Sale price</h4>
                <Input placeholder='$$$' style={{ width: 200, padding: '8px 5px', margin: 0 }}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}        
                />
              </div>
            </div>
          </div>
          <div className='pricing-container'>
            <span>Restock</span>
            <div className='pricing-content'>
              <div>
                <h4 className='input-title'>Add to Stock</h4>
                <Input placeholder='$$$' type='number' style={{ width: 200, padding: '8px 5px', margin: 0 }}
                  onChange={(e) => handleInputChange('quantity', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className='pricing-container'>
            <span>Product Type</span>
            <div className='pricing-content'>
              <div>
                <h4 className='input-title'>Type</h4>
                <Input placeholder='$$$'  style={{ width: 200, padding: '8px 5px', margin: 0 }}
                  onChange={(e) => handleInputChange('productType', e.target.value)} 
                />
              </div>
            </div>
          </div>

        </div>

        <div className='select-container'>
          <div className='select-form'>
            <h2>Organize</h2>
            <div className='select-item'>
              <span>Category <a href="">Add new category</a></span>
              <Select placeholder="Category"
                onChange={(value) => handleInputChange('category', value)}
              >
              {categories?.map((category)=>(
                 <Option key={category._id} value={category._id}>{category.category_name}</Option>
              ))  }                
              </Select>
            </div>

            <div className='select-item'>
              <span>Brand <a href="">Add new Brand</a></span>
              <Select placeholder="Brand"
                onChange={(value) => handleInputChange('brand', value)}
              >
              {brands.data?.map((brand)=>(
                 <Option key={brand._id} value={brand._id}>{brand.brand_name}</Option>
              ))}      
              
              </Select>
            </div>

            <div className='select-item'>
              <span>Collection</span>
              <Select placeholder="Collection"
                onChange={(value) => handleInputChange('collection', value)}
              >
                <Option value="1">Option 1</Option>
                <Option value="2">Option 2</Option>
                <Option value="3">Option 3</Option>
              </Select>
            </div>
            <div className='select-item'>
              <span>Tags <a href="">Add new Tag</a></span>
              <Select mode="multiple" placeholder="Tags"
                onChange={(value) => handleInputChange('tags', value)}
              >
              {tags?.map((tag) => (
                    <Option key={tag._id} value={tag._id}>
                        {tag.tag}
                    </Option>
                ))}
              </Select>
            </div>           
          </div>


           <div className='select-form'>
              <h2>Variants</h2>
              {variants.map((variant, index) => (
                <div key={variant.id} className="variant-item">
                 <span>{variant.name} <a href="">remove</a></span>

                  <Select
                    placeholder='Select Type'
                    onChange={(value) => handleVariantChange(index, value)}
                  >
                    <Option value="size">Size</Option>
                    <Option value="color">Color</Option>
                  </Select>
                  
                  <Select
                    placeholder="Select Option"
                    mode='multiple'
                    onChange={(value) => handleOptionChange(index, value)}
                  >
                    {availableOptions.map(option => (
                      option.option_name === variant.type &&
                      option.options.map(option => (
                        <Option key={option._id} value={option.type}>{option.type}</Option>
                      ))
                    ))}
                  </Select>
                </div>
              ))}
            
              <Button
                type="dashed"
                onClick={handleAddVariant}
                style={{ width: '100%', marginTop: '16px' }}
              >
                <PlusOutlined /> Add new option
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
