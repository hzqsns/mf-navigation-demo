import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Button, Select, DatePicker, Space, Divider, Tag } from 'antd';
import dayjs from 'dayjs';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据
const generateRandomData = () => {
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomFloat = (min: number, max: number) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  };

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  return {
    cpuUsage: getRandomFloat(20, 80),
    memoryUsage: getRandomFloat(30, 75),
    diskUsage: getRandomFloat(15, 90),
    networkIn: getRandomInt(5, 50),
    networkOut: getRandomInt(5, 40),
    requestsPerSecond: getRandomInt(50, 500),
    responseTime: getRandomInt(50, 300),
    errorRate: getRandomFloat(0.1, 3.0),
    uptime: getRandomInt(98, 100),
    activeUsers: getRandomInt(80, 300),
    successfulDeployments: getRandomInt(5, 15),
    failedDeployments: getRandomInt(0, 3),
    timestamp: dayjs(now),
    previousTimestamp: dayjs(hourAgo),
  };
};

const MonitorDashboard: React.FC = () => {
  const [data, setData] = useState(generateRandomData());
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState('prod');

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generateRandomData());
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
    const intervalId = setInterval(refreshData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const renderTrendIcon = (current: number, previous: number) => {
    const percentage = ((current - previous) / previous) * 100;
    if (percentage > 0) {
      return <ArrowUpOutlined style={{ color: percentage > 10 ? 'red' : 'orange' }} />;
    } else {
      return <ArrowDownOutlined style={{ color: 'green' }} />;
    }
  };

  return (
    <>
      <Card
        title={
          <Space>
            <DashboardOutlined /> 系统监控面板
          </Space>
        }
        extra={
          <Space>
            <Select value={environment} onChange={value => setEnvironment(value)}>
              <Option value="dev">开发环境</Option>
              <Option value="test">测试环境</Option>
              <Option value="staging">预发环境</Option>
              <Option value="prod">生产环境</Option>
            </Select>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              defaultValue={[data.previousTimestamp, data.timestamp]}
            />
            <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
              刷新
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="系统状态" bordered={false}>
              <Statistic
                title="系统可用性"
                value={data.uptime}
                precision={2}
                valueStyle={{ color: data.uptime >= 99.9 ? '#3f8600' : '#cf1322' }}
                suffix="%"
                prefix={<CloudServerOutlined />}
              />
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="CPU使用率"
                    value={data.cpuUsage}
                    precision={1}
                    valueStyle={{ color: data.cpuUsage > 70 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="内存使用率"
                    value={data.memoryUsage}
                    precision={1}
                    valueStyle={{ color: data.memoryUsage > 80 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Divider />
              <Statistic
                title="磁盘使用率"
                value={data.diskUsage}
                precision={1}
                valueStyle={{ color: data.diskUsage > 85 ? '#cf1322' : '#3f8600' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="网络与请求" bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="入站流量"
                    value={data.networkIn}
                    suffix="MB/s"
                    prefix={<ArrowDownOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="出站流量"
                    value={data.networkOut}
                    suffix="MB/s"
                    prefix={<ArrowUpOutlined />}
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="请求量"
                    value={data.requestsPerSecond}
                    suffix="req/s"
                    prefix={<ApiOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="响应时间"
                    value={data.responseTime}
                    suffix="ms"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: data.responseTime > 200 ? '#cf1322' : '#3f8600' }}
                  />
                </Col>
              </Row>
              <Divider />
              <Statistic
                title="错误率"
                value={data.errorRate}
                precision={2}
                valueStyle={{ color: data.errorRate > 1 ? '#cf1322' : '#3f8600' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="应用状态" bordered={false}>
              <Statistic
                title="活跃用户"
                value={data.activeUsers}
                precision={0}
                prefix={<DatabaseOutlined />}
                suffix={
                  <span>用户 {renderTrendIcon(data.activeUsers, data.activeUsers * 0.9)}</span>
                }
              />
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="成功部署"
                    value={data.successfulDeployments}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="失败部署"
                    value={data.failedDeployments}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Col>
              </Row>
              <Divider />
              <div>
                <div style={{ marginBottom: 8 }}>热门服务：</div>
                <Space wrap>
                  <Tag color="blue">api-gateway</Tag>
                  <Tag color="green">auth-service</Tag>
                  <Tag color="orange">data-processor</Tag>
                  <Tag color="purple">user-service</Tag>
                  <Tag color="cyan">notification</Tag>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MonitorDashboard;
