import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Input, Badge, Tooltip, Collapse } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import debounce from 'lodash/debounce';

interface ServiceItem {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'warning' | 'error';
  type: string;
  version: string;
  lastDeployed: string;
  cpu: number;
  memory: number;
  deployCount?: number;
  tags?: string[];
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
  const [stats, setStats] = useState<any>({});

  // 扩展数据集，添加标签和部署次数
  const rawData: ServiceItem[] = [
    {
      id: '1',
      name: 'api-gateway',
      status: 'running',
      type: '网关服务',
      version: 'v1.2.3',
      lastDeployed: '2024-03-29 14:30:25',
      cpu: 12.5,
      memory: 256,
      tags: ['核心服务', '高可用', 'API'],
      deployCount: 18,
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
      tags: ['认证', '安全', '核心服务'],
      deployCount: 12,
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
      tags: ['数据', '批处理', '分析'],
      deployCount: 7,
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
      tags: ['消息', '通知', '邮件'],
      deployCount: 5,
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
      tags: ['日志', '监控', '分析'],
      deployCount: 9,
    },
    {
      id: '6',
      name: 'user-service',
      status: 'running',
      type: '用户服务',
      version: 'v3.0.2',
      lastDeployed: '2024-03-24 12:08:21',
      cpu: 18.4,
      memory: 245,
      tags: ['用户', '核心服务', '认证'],
      deployCount: 14,
    },
    {
      id: '7',
      name: 'payment-service',
      status: 'running',
      type: '支付服务',
      version: 'v1.7.3',
      lastDeployed: '2024-03-23 09:32:17',
      cpu: 7.8,
      memory: 187,
      tags: ['支付', '交易', '安全'],
      deployCount: 8,
    },
  ];

  // 使用数据处理
  const [data, setData] = useState<ServiceItem[]>(rawData);

  // 使用原生JS方法进行数据分组和统计
  useEffect(() => {
    // 按状态分组统计
    const statusStats = rawData.reduce(
      (acc, service) => {
        acc[service.status] = (acc[service.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // 按类型分组
    const typeGroups = rawData.reduce(
      (acc, service) => {
        acc[service.type] = acc[service.type] || [];
        acc[service.type].push(service);
        return acc;
      },
      {} as Record<string, ServiceItem[]>
    );

    const typeCounts = Object.fromEntries(
      Object.entries(typeGroups).map(([key, group]) => [key, group.length])
    );

    // 计算资源使用平均值
    const runningServices = rawData.filter(service => service.status === 'running');
    const avgCpu = (
      runningServices.reduce((sum, service) => sum + service.cpu, 0) / runningServices.length
    ).toFixed(1);
    const avgMemory = (
      runningServices.reduce((sum, service) => sum + service.memory, 0) / runningServices.length
    ).toFixed(0);

    // 获取最常用的标签
    const allTags = rawData.flatMap(service => service.tags || []);
    const tagFrequency = allTags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const popularTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    setStats({
      statusStats,
      typeCounts,
      avgCpu,
      avgMemory,
      popularTags,
    });
  }, []);

  // 使用lodash的debounce函数延迟处理搜索
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
    // 使用原生filter进行多条件过滤
    const filtered = rawData.filter(service => {
      const searchLower = value.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.type.toLowerCase().includes(searchLower) ||
        service.version.toLowerCase().includes(searchLower) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
    setData(filtered);
  }, 300);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // 使用原生方法随机排序数据，模拟刷新
      const shuffled = [...rawData].sort(() => Math.random() - 0.5);
      setData(shuffled);
      setLoading(false);
    }, 1000);
  };

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
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags?: string[]) => (
        <Space wrap>
          {tags?.map(tag => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
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

  // 使用原生方法进行排序
  const sortedData = [...data].sort((a, b) => {
    // 先按状态排序
    if (a.status !== b.status) {
      const statusOrder = { running: 1, warning: 2, stopped: 3, error: 4 };
      return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    }
    // 再按名称排序
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <Card
        title="服务列表"
        extra={
          <Space>
            <Input
              placeholder="搜索服务"
              prefix={<SearchOutlined />}
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
          </Space>
        }
      >
        {/* 服务统计信息 */}
        <Collapse ghost style={{ marginBottom: 16 }}>
          <Collapse.Panel header="服务统计" key="1">
            <Space wrap size="large">
              <div>
                <b>运行状态：</b>
                {Object.entries(stats.statusStats || {}).map(([status, count]) => (
                  <Tag
                    color={statusMap[status as keyof typeof statusMap]?.color as any}
                    key={status}
                  >
                    {statusMap[status as keyof typeof statusMap]?.text}: {count}
                  </Tag>
                ))}
              </div>
              <div>
                <b>平均资源使用：</b> CPU {stats.avgCpu || 0}% / 内存 {stats.avgMemory || 0} MB
              </div>
              <div>
                <b>热门标签：</b>
                {(stats.popularTags || []).map(tag => (
                  <Tag color="purple" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </Space>
          </Collapse.Panel>
        </Collapse>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={sortedData}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

export default ServiceList;
