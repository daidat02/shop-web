import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Calendar, 
  Badge,
  Progress,
  Select
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import './AdminHome.css';

const { Option } = Select;

const AdminHome = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // Mock data - thay thế bằng data thực từ API
  const revenueData = [
    { date: '2024-01', revenue: 15000000 },
    { date: '2024-02', revenue: 25000000 },
    { date: '2024-03', revenue: 18000000 },
    { date: '2024-04', revenue: 30000000 },
    { date: '2024-05', revenue: 28000000 },
    { date: '2024-06', revenue: 35000000 },
  ];

  const orderStatusData = [
    { status: 'Hoàn thành', value: 45 },
    { status: 'Đang xử lý', value: 25 },
    { status: 'Đã hủy', value: 10 },
    { status: 'Đang giao', value: 20 },
  ];

  const topProducts = [
    { 
      key: '1',
      name: 'Sản phẩm A',
      sales: 120,
      revenue: 12000000,
      growth: 23.4
    },
    { 
      key: '2',
      name: 'Sản phẩm B',
      sales: 98,
      revenue: 9800000,
      growth: 15.2
    },
    { 
      key: '3',
      name: 'Sản phẩm C',
      sales: 86,
      revenue: 8600000,
      growth: -5.8
    },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#fff 0.5:#7ec2f3 1:#1890ff',
    },
    line: {
      color: '#1890ff',
    },
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      label: {
        formatter: (value) => `${(value / 1000000).toFixed(1)}M`,
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: 'Doanh thu',
          value: data.revenue.toLocaleString('vi-VN') + ' đ',
        };
      },
    },
  };

  const orderStatusConfig = {
    data: orderStatusData,
    xField: 'status',
    yField: 'value',
    color: ['#1890ff', '#ffd666', '#ff4d4f', '#52c41a'],
    label: {
      // Đã sửa cấu hình label
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
      formatter: (data) => `${data.value}%`,
    },
    meta: {
      status: {
        alias: 'Trạng thái',
      },
      value: {
        alias: 'Số lượng',
        formatter: (val) => `${val}%`,
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: data.status,
          value: `${data.value}%`,
        };
      },
    },
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đã bán',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => value.toLocaleString('vi-VN') + ' đ',
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growth',
      key: 'growth',
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      ),
      sorter: (a, b) => a.growth - b.growth,
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tổng quan</h1>
        <Select 
          defaultValue="week" 
          onChange={setTimeRange}
          className="time-range-select"
        >
          <Option value="today">Hôm nay</Option>
          <Option value="week">Tuần này</Option>
          <Option value="month">Tháng này</Option>
          <Option value="year">Năm nay</Option>
        </Select>
      </div>

      <Row gutter={[24, 24]} className="stats-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card revenue">
            <Statistic
              title="Tổng doanh thu"
              value={35000000}
              prefix={<DollarOutlined />}
              suffix="đ"
              formatter={(value) => value.toLocaleString('vi-VN')}
            />
            <div className="stat-footer">
              <span className="growth positive">
                <ArrowUpOutlined /> 12.5%
              </span>
              <span className="period">so với tuần trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card orders">
            <Statistic
              title="Đơn hàng"
              value={128}
              prefix={<ShoppingCartOutlined />}
            />
            <div className="stat-footer">
              <span className="growth positive">
                <ArrowUpOutlined /> 8.2%
              </span>
              <span className="period">so với tuần trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card customers">
            <Statistic
              title="Khách hàng mới"
              value={45}
              prefix={<UserOutlined />}
            />
            <div className="stat-footer">
              <span className="growth negative">
                <ArrowDownOutlined /> 3.1%
              </span>
              <span className="period">so với tuần trước</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card products">
            <Statistic
              title="Sản phẩm đã bán"
              value={356}
              prefix={<ShoppingOutlined />}
            />
            <div className="stat-footer">
              <span className="growth positive">
                <ArrowUpOutlined /> 15.3%
              </span>
              <span className="period">so với tuần trước</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="charts-section">
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ doanh thu" bordered={false}>
            <Area {...revenueConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái đơn hàng" bordered={false}>
            <Column {...orderStatusConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="data-section">
        <Col xs={24} lg={16}>
          <Card title="Sản phẩm bán chạy" bordered={false}>
            <Table 
              columns={columns} 
              dataSource={topProducts}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Lịch hoạt động" bordered={false}>
            <Calendar 
              fullscreen={false} 
              headerRender={() => null}
              dateCellRender={(date) => {
                const events = []; // Replace with actual events
                return events.map(event => (
                  <Badge status={event.type} text={event.content} />
                ));
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;