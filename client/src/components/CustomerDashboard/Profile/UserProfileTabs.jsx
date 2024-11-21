import React, { useState } from 'react';
import { Tabs, Input, Button, Form, message, DatePicker, Select, Row, Col } from 'antd';
import './profile.css';

const UserProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [personalForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handlePersonalInfoSubmit = (values) => {
    console.log('Personal Info:', values);
    message.success('Thông tin cá nhân đã được cập nhật');
  };

  const handleAddressSubmit = (values) => {
    console.log('Address:', values);
    message.success('Địa chỉ đã được cập nhật');
  };

  const handlePasswordChange = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }
    console.log('Changing password');
    message.success('Mật khẩu đã được thay đổi');
  };

  return (
    <div className="user-profile-container">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
      >
        <Tabs.TabPane tab="Thông Tin Cá Nhân" key="1">
            <div className='update-profile-container'>
                <div>
                    
                </div>
            </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Địa Chỉ" key="2">
          <Form 
            form={addressForm}
            layout="vertical"
            onFinish={handleAddressSubmit}
            className="profile-form"
          >
            <Form.Item 
              name="street" 
              label="Địa Chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="city" 
                  label="Thành Phố"
                  rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="province" 
                  label="Tỉnh/Bang"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item 
              name="postalCode" 
              label="Mã Bưu Chính"
              rules={[{ required: true, message: 'Vui lòng nhập mã bưu chính' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lưu Địa Chỉ
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đổi Mật Khẩu" key="3">
          <Form 
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
            className="profile-form"
          >
            <Form.Item 
              name="currentPassword" 
              label="Mật Khẩu Hiện Tại"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item 
              name="newPassword" 
              label="Mật Khẩu Mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item 
              name="confirmPassword" 
              label="Xác Nhận Mật Khẩu Mới"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đổi Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UserProfileTabs;