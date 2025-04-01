import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Badge, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

interface ServiceItem {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'warning' | 'error';
  type: string;
  version: string;
  lastDeployed: string;
  cpu: number;
  memory: number;
}

const statusMap = {
  running: { color: 'green', text: '运行中' },
  stopped: { color: 'default', text: '已停止' },
  warning: { color: 'orange', text: '警告' },
  error: { color: 'red', text: '错误' },
};

const ServiceList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const data: ServiceItem[] = [
    {
      id: '1',
      name: 'api-gateway',
      status: 'running',
      type: '网关服务',
      version: 'v1.2.3',
      lastDeployed: '2024-03-29 14:30:25',
      cpu: 12.5,
      memory: 256,
    },
    {
      id: '2',
      name: 'auth-service',
      status: 'running',
      type: '认证服务',
      version: 'v2.0.1',
      lastDeployed: '2024-03-28 09:15:42',
      cpu: 8.2,
      memory: 198,
    },
    {
      id: '3',
      name: 'data-processor',
      status: 'warning',
      type: '数据处理',
      version: 'v1.5.0',
      lastDeployed: '2024-03-27 11:22:33',
      cpu: 65.7,
      memory: 512,
    },
    {
      id: '4',
      name: 'notification-service',
      status: 'stopped',
      type: '通知服务',
      version: 'v1.1.0',
      lastDeployed: '2024-03-26 16:45:11',
      cpu: 0,
      memory: 0,
    },
    {
      id: '5',
      name: 'logging-service',
      status: 'error',
      type: '日志服务',
      version: 'v2.3.1',
      lastDeployed: '2024-03-25 10:18:36',
      cpu: 5.3,
      memory: 110,
    },
  ];

  const columns: TableProps<ServiceItem>['columns'] = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusMap) => (
        <Badge status={statusMap[status].color as any} text={statusMap[status].text} />
      ),
      filters: Object.entries(statusMap).map(([key, value]) => ({ text: value.text, value: key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: text => <Tag>{text}</Tag>,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '最近部署时间',
      dataIndex: 'lastDeployed',
      key: 'lastDeployed',
      sorter: (a, b) => new Date(a.lastDeployed).getTime() - new Date(b.lastDeployed).getTime(),
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpu',
      key: 'cpu',
      render: cpu => {
        let color = 'green';
        if (cpu > 60) color = 'orange';
        if (cpu > 80) color = 'red';
        return <Tag color={color}>{cpu}%</Tag>;
      },
      sorter: (a, b) => a.cpu - b.cpu,
    },
    {
      title: '内存使用',
      dataIndex: 'memory',
      key: 'memory',
      render: memory => `${memory} MB`,
      sorter: (a, b) => a.memory - b.memory,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="配置">
            <Button type="text" icon={<SettingOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase()) ||
      item.version.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Card
      title="服务列表"
      extra={
        <Space>
          <Input
            placeholder="搜索服务"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ServiceList;
