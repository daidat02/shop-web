import React, { useState } from 'react';
import { Radio, Button, Form, Input, Select, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateAddressDefault } from '../../../api/API_User';
import NotificationMessage from '../../Message/NotificationMessage';

const { Option } = Select;

const AddressComponent = ({ 
    addressData, 
    selectedAddress, 
    handleAddressChange, 
    onApplyAddress, 
    onCancel ,
    updateAddressDefault
}) => {
    const [newAddressForm] = Form.useForm();
    const [isShowAddForm, setIsShowAddForm] = useState(false);
    const [newAddress,setNewAddress]= useState()

    const handleAddNewAddress = () => {
        setIsShowAddForm(true);
    };

    const handleSaveNewAddress = () => {            
        newAddressForm.validateFields()
            .then(values => {
                if(onApplyAddress){
                    onApplyAddress(values)
                    setIsShowAddForm(false)
                }
            })
            .catch(errorInfo => {
                console.log('Validate Failed:', errorInfo);
            });
    };

    const handelUpdateAddressDefault = (addressId) => {
        if (updateAddressDefault) {
          updateAddressDefault(addressId); // Gọi hàm từ component cha
        }
      };

    return (
        <div className='address-container'>
            <div className="address-header">
                <h2>Địa chỉ của tôi</h2>
                <Button 
                    type="dashed" 
                    icon={<PlusOutlined />} 
                    onClick={handleAddNewAddress}
                >
                    Thêm địa chỉ mới
                </Button>
            </div>

            {!isShowAddForm ? (
                <div className="address-content">
                    <div className='list-item'>
                        <Radio.Group
                            onChange={(e) => handleAddressChange(e.target.value)}
                            value={selectedAddress?._id}
                            style={{ width: '100%' }}
                        >
                            {addressData?.map((address) => (
                                <Radio
                                    key={address._id}
                                    value={address._id}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px', 
                                        marginBottom: '8px' 
                                    }}
                                >
                                    <div className='address-item'>
                                        <div>
                                            <strong>{address.recipient_name}</strong> - {address.phone_number}
                                            <p>{`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                                            {address.is_default && (
                                                <span style={{ color: 'blue', marginLeft: '10px' }} >
                                                    (Địa chỉ mặc định)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                </div>
            ) : (
                <div className="address-content">
                    <Form
                        form={newAddressForm}
                        layout="vertical"
                        name="new_address_form"
                        className="add-address-form"
                    >
                        <div className='row'>   
                            <Form.Item
                                name="recipient_name"
                                label="Tên Người Nhận"
                                rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
                            >
                                <Input placeholder="Nhập tên người nhận" />
                            </Form.Item>

                            <Form.Item
                                name="phone_number"
                                label="Số Điện Thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { 
                                        pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                                        message: 'Số điện thoại không hợp lệ'
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </div>
                       

                        <Form.Item
                            name="province"
                            label="Tỉnh/Thành Phố"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                        >
                            <Input placeholder="Nhập Tỉnh/Thành Phố" />
                        </Form.Item>

                        <div className='row'> 
                            <Form.Item
                                name="district"
                                label="Quận/Huyện"
                                rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                            >
                             <Input placeholder="Nhập Quận/Huyện" />
                            </Form.Item>

                            <Form.Item
                                name="ward"
                                label="Phường/Xã"
                                rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                            >
                                <Input placeholder="Nhập Phường/Xã" />

                            </Form.Item>
                        </div>
                            
                        <Form.Item
                            name="street"
                            label="Địa Chỉ Chi Tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                        >
                            <Input.TextArea 
                                rows={2} 
                                placeholder="Nhập số nhà, tên đường, v.v." 
                            />
                        </Form.Item>

                        <Form.Item name="isDefault" valuePropName="checked">
                            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                        </Form.Item>

                        <div className='address-action'>
                            <Button 
                                type="primary" 
                                onClick={handleSaveNewAddress}
                            >
                                Lưu Địa Chỉ
                            </Button>
                            <Button onClick={() => setIsShowAddForm(false)}>Hủy</Button>
                        </div>
                    </Form>
                </div>
            )}

            {!isShowAddForm && (
                <div className='address-action'>
                    <Button type="primary"  onClick={() => handelUpdateAddressDefault(selectedAddress?._id)}>Mặc định</Button>
                    <Button onClick={onCancel}>Hủy</Button>
                </div>
            )}
        </div>
    );
};

export default AddressComponent;