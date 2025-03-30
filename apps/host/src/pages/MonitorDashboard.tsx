import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Button,
  Select,
  DatePicker,
  Space,
  Divider,
  Tag,
  Progress,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import random from 'lodash/random';
import chunk from 'lodash/chunk';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟系统指标历史数据
const generateHistoricalData = () => {
  const result = [];
  const now = dayjs();

  // 生成过去12小时的数据点，每小时一个
  for (let i = 11; i >= 0; i--) {
    const timestamp = now.subtract(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    result.push({
      timestamp,
      cpu: random(10, 85, true).toFixed(1),
      memory: random(20, 80, true).toFixed(1),
      requestCount: random(100, 800),
      responseTime: random(40, 350),
      errorRate: random(0, 5, true).toFixed(2),
    });
  }

  return result;
};

// 模拟警报数据
const alertData = [
  {
    id: 'a1',
    service: 'data-processor',
    severity: 'high',
    message: 'CPU使用率超过阈值',
    timestamp: dayjs().subtract(25, 'minute').format('HH:mm:ss'),
  },
  {
    id: 'a2',
    service: 'logging-service',
    severity: 'critical',
    message: '服务不可用',
    timestamp: dayjs().subtract(2, 'hour').format('HH:mm:ss'),
  },
  {
    id: 'a3',
    service: 'api-gateway',
    severity: 'medium',
    message: '响应时间增加',
    timestamp: dayjs().subtract(4, 'hour').format('HH:mm:ss'),
  },
];

// 模拟系统事件数据
const eventData = [
  {
    id: 'e1',
    type: 'deployment',
    service: 'auth-service',
    message: '部署完成 v2.0.1',
    timestamp: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    id: 'e2',
    type: 'scaling',
    service: 'api-gateway',
    message: '扩展副本数到3',
    timestamp: dayjs().subtract(7, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    id: 'e3',
    type: 'incident',
    service: 'logging-service',
    message: '服务重启',
    timestamp: dayjs().subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    id: 'e4',
    type: 'maintenance',
    service: 'all',
    message: '系统维护',
    timestamp: dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  },
];

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

  const historicalData = generateHistoricalData();

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
    historicalData,
    alerts: alertData,
    events: eventData,
  };
};

const MonitorDashboard: React.FC = () => {
  const [data, setData] = useState(generateRandomData());
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState('prod');
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    data.previousTimestamp,
    data.timestamp,
  ]);

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

  // 使用原生函数实现缓存机制
  const colorCache = new Map<string, string>();
  const getStatusColor = (value: number, thresholds: [number, number]) => {
    const key = `${value}-${thresholds[0]}-${thresholds[1]}`;
    if (colorCache.has(key)) {
      return colorCache.get(key);
    }

    let color;
    if (value > thresholds[1]) color = 'red';
    else if (value > thresholds[0]) color = 'orange';
    else color = 'green';

    colorCache.set(key, color);
    return color;
  };

  // 处理报警数据的表格列
  const alertColumns = [
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '等级',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colorMap: Record<string, string> = {
          low: 'blue',
          medium: 'orange',
          high: 'red',
          critical: 'purple',
        };
        return (
          <Tag color={colorMap[severity]}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: '信息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  // 使用原生方法计算聚合指标
  const aggregatedMetrics = useMemo(() => {
    if (!data.historicalData) return null;

    // 平均值计算辅助函数
    const calculateAverage = (arr: any[], key: string): number =>
      arr.reduce((sum, item) => sum + Number(item[key]), 0) / arr.length;

    // 获取最大值辅助函数
    const getMaxValue = (arr: any[], key: string): string | undefined => {
      let maxItem = arr[0];
      for (const item of arr) {
        if (Number(item[key]) > Number(maxItem[key])) {
          maxItem = item;
        }
      }
      return maxItem?.[key];
    };

    // 获取最小值辅助函数
    const getMinValue = (arr: any[], key: string): string | undefined => {
      let minItem = arr[0];
      for (const item of arr) {
        if (Number(item[key]) < Number(minItem[key])) {
          minItem = item;
        }
      }
      return minItem?.[key];
    };

    // 趋势分析
    const recent = data.historicalData.slice(-3);
    const previous = data.historicalData.slice(-6, -3);
    const recentAvg = calculateAverage(recent, 'cpu');
    const previousAvg = calculateAverage(previous, 'cpu');
    const direction = recentAvg > previousAvg ? 'up' : 'down';
    const percentage = Math.abs(((recentAvg - previousAvg) / previousAvg) * 100).toFixed(1);

    // 计算总请求数
    const totalRequests = data.historicalData.reduce(
      (sum, item) => sum + Number(item.requestCount),
      0
    );

    // 使用lodash的chunk将数据分成3组并计算每组的平均错误率
    const chunkedData = chunk(data.historicalData, Math.ceil(data.historicalData.length / 3));
    const hourlyErrorRates = chunkedData.map(group =>
      calculateAverage(group, 'errorRate').toFixed(2)
    );

    return {
      // 平均值计算
      avgCpu: calculateAverage(data.historicalData, 'cpu').toFixed(1),
      avgMemory: calculateAverage(data.historicalData, 'memory').toFixed(1),
      avgResponseTime: calculateAverage(data.historicalData, 'responseTime').toFixed(0),

      // 最大/最小值
      maxCpu: getMaxValue(data.historicalData, 'cpu'),
      minCpu: getMinValue(data.historicalData, 'cpu'),

      // 趋势分析
      cpuTrend: { direction, percentage },

      // 总请求数
      totalRequests,

      // 每个小时的平均错误率
      hourlyErrorRates,
    };
  }, [data.historicalData]);

  const renderTrendIcon = (current: number, previous: number) => {
    const percentage = ((current - previous) / previous) * 100;
    if (percentage > 0) {
      return <ArrowUpOutlined style={{ color: percentage > 10 ? 'red' : 'orange' }} />;
    } else {
      return <ArrowDownOutlined style={{ color: 'green' }} />;
    }
  };

  // 使用原生方法过滤事件
  const getFilteredEvents = (type?: string) => {
    if (!type) return data.events;
    return data.events.filter(event => event.type === type);
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
              onChange={dates => {
                if (dates && dates[0] && dates[1]) {
                  setTimeRange([dates[0], dates[1]]);
                }
              }}
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
                  {aggregatedMetrics && (
                    <Tooltip
                      title={`最近趋势: ${aggregatedMetrics.cpuTrend.direction === 'up' ? '上升' : '下降'} ${aggregatedMetrics.cpuTrend.percentage}%`}
                    >
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 12 }}>
                          平均: {aggregatedMetrics.avgCpu}% &nbsp;
                          {aggregatedMetrics.cpuTrend.direction === 'up' ? (
                            <ArrowUpOutlined style={{ color: 'red' }} />
                          ) : (
                            <ArrowDownOutlined style={{ color: 'green' }} />
                          )}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                </Col>
                <Col span={12}>
                  <Statistic
                    title="内存使用率"
                    value={data.memoryUsage}
                    precision={1}
                    valueStyle={{ color: data.memoryUsage > 80 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                  {aggregatedMetrics && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12 }}>平均: {aggregatedMetrics.avgMemory}%</span>
                    </div>
                  )}
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
              <Progress
                percent={data.diskUsage}
                size="small"
                status={data.diskUsage > 85 ? 'exception' : 'normal'}
                style={{ marginTop: 8 }}
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
                  {aggregatedMetrics && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12 }}>
                        总计: {Number(aggregatedMetrics.totalRequests).toLocaleString()} 请求
                      </span>
                    </div>
                  )}
                </Col>
                <Col span={12}>
                  <Statistic
                    title="响应时间"
                    value={data.responseTime}
                    suffix="ms"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: data.responseTime > 200 ? '#cf1322' : '#3f8600' }}
                  />
                  {aggregatedMetrics && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12 }}>
                        平均: {aggregatedMetrics.avgResponseTime} ms
                      </span>
                    </div>
                  )}
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
              {aggregatedMetrics && (
                <Tooltip title="每小时平均错误率">
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    {aggregatedMetrics.hourlyErrorRates.map((rate, index) => (
                      <Tag key={index} color={getStatusColor(parseFloat(rate), [1, 3])}>
                        {index === 0 ? '早' : index === 1 ? '中' : '晚'}：{rate}%
                      </Tag>
                    ))}
                  </div>
                </Tooltip>
              )}
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

        {/* 告警和事件 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card
              title={
                <Space>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  系统告警
                </Space>
              }
              bordered={false}
            >
              <Table
                columns={alertColumns}
                dataSource={data.alerts.sort((a, b) => {
                  // 使用原生排序按严重程度排序
                  const severityOrder: Record<string, number> = {
                    critical: 4,
                    high: 3,
                    medium: 2,
                    low: 1,
                  };
                  return severityOrder[b.severity] - severityOrder[a.severity];
                })}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <Space>
                  <LineChartOutlined />
                  系统事件
                </Space>
              }
              bordered={false}
              extra={
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  onChange={value =>
                    setData({
                      ...data,
                      events: value === 'all' ? eventData : getFilteredEvents(value),
                    })
                  }
                >
                  <Option value="all">全部</Option>
                  <Option value="deployment">部署</Option>
                  <Option value="scaling">伸缩</Option>
                  <Option value="incident">故障</Option>
                  <Option value="maintenance">维护</Option>
                </Select>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {data.events.map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      borderBottom: index < data.events.length - 1 ? '1px dashed #f0f0f0' : 'none',
                      paddingBottom: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <Tag
                        color={
                          event.type === 'deployment'
                            ? 'blue'
                            : event.type === 'scaling'
                              ? 'green'
                              : event.type === 'incident'
                                ? 'red'
                                : 'orange'
                        }
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Tag>
                      <Tag>{event.service}</Tag>
                      <span style={{ float: 'right', fontSize: 12, color: '#999' }}>
                        {event.timestamp}
                      </span>
                    </div>
                    <div style={{ marginTop: 4 }}>{event.message}</div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MonitorDashboard;
