import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Divider,
  Radio,
  InputNumber,
  Switch,
  Tooltip,
  message,
  Steps,
  Alert,
  Tag,
} from 'antd';
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CodeOutlined,
  BranchesOutlined,
  SettingOutlined,
  RocketOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import throttle from 'lodash/throttle';

const { Option } = Select;
const { TextArea } = Input;

// 使用模板字符串替代lodash模板功能
const descriptionTemplates = {
  feature: (data: any) =>
    `部署新功能：${data.feature}，版本号 ${data.version}，包含${data.changes}等更新。`,
  bugfix: (data: any) =>
    `修复 ${data.issue} 问题，优化了${data.optimization}，版本号 ${data.version}。`,
  hotfix: (data: any) =>
    `紧急修复：${data.issue}，影响范围：${data.scope}，版本号 ${data.version}。`,
  release: (data: any) =>
    `${data.version} 正式发布，包含${data.features}等特性，修复了${data.fixes}等问题。`,
};

// 历史部署记录
const deploymentHistory = [
  {
    id: 'd001',
    serviceName: 'api-gateway',
    environment: 'prod',
    version: 'v1.2.3',
    timestamp: '2024-03-29 14:30:25',
    status: 'success',
  },
  {
    id: 'd002',
    serviceName: 'auth-service',
    environment: 'prod',
    version: 'v2.0.1',
    timestamp: '2024-03-28 09:15:42',
    status: 'success',
  },
  {
    id: 'd003',
    serviceName: 'data-processor',
    environment: 'test',
    version: 'v1.5.1',
    timestamp: '2024-03-27 11:22:33',
    status: 'failed',
  },
];

// 服务配置预设
const servicePresets = {
  'api-gateway': {
    repository: 'api-gateway',
    buildCommand: 'npm run build',
    replicas: 3,
    cpu: 1.0,
    memory: 512,
    deploymentType: 'rolling',
  },
  'auth-service': {
    repository: 'auth-service',
    buildCommand: 'npm run build:prod',
    replicas: 2,
    cpu: 0.5,
    memory: 384,
    deploymentType: 'blue-green',
  },
  'data-processor': {
    repository: 'data-processor',
    buildCommand: 'npm run build',
    replicas: 2,
    cpu: 1.5,
    memory: 1024,
    deploymentType: 'canary',
  },
};

const DeploymentForm: React.FC = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentDeployments, setRecentDeployments] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // 使用lodash的throttle防止频繁验证
  const validateFields = throttle(() => {
    form
      .validateFields()
      .then(() => {
        setFormErrors([]);
      })
      .catch(errorInfo => {
        // 获取错误信息
        const errors = errorInfo.errorFields.flatMap(field => field.errors);
        setFormErrors(errors);
      });
  }, 500);

  useEffect(() => {
    // 使用原生方法筛选最近的部署记录
    const recent = deploymentHistory
      .filter(record => record.environment === 'prod' || record.environment === 'staging')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);

    setRecentDeployments(recent);
  }, []);

  const handleFinish = (values: any) => {
    setLoading(true);

    // 使用解构和原生方法选择需要的字段
    const { serviceName, environment, version, repository, branch, deploymentType, replicas } =
      values;
    const deploymentData = {
      serviceName,
      environment,
      version,
      repository,
      branch,
      deploymentType,
      replicas,
    };

    // 合并默认值和表单数据
    const finalData = {
      timestamp: new Date().toISOString(),
      status: 'pending',
      id: `d${Date.now()}`,
      ...deploymentData,
    };

    console.log('提交的表单数据:', finalData);

    // 模拟提交
    setTimeout(() => {
      message.success('部署任务已提交成功！');
      setLoading(false);

      // 使用原生方法更新部署历史
      const newHistory = [finalData, ...recentDeployments].slice(0, 3);
      setRecentDeployments(newHistory);
    }, 1500);
  };

  // 应用模板
  const applyTemplate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const currentValues = form.getFieldsValue();
    let description = '';

    // 准备模板参数
    const templateData = {
      version: currentValues.version || 'vX.Y.Z',
      feature: '用户管理功能',
      changes: '界面优化、性能提升',
      issue: '登录失败',
      optimization: '页面加载速度',
      scope: '影响所有用户',
      features: '新增报表功能',
      fixes: '数据导出问题',
    };

    // 使用模板函数生成描述
    description =
      descriptionTemplates[templateType as keyof typeof descriptionTemplates](templateData);
    form.setFieldsValue({ description });
  };

  // 应用服务预设配置
  const applyServicePreset = (serviceName: string) => {
    if (serviceName && servicePresets[serviceName as keyof typeof servicePresets]) {
      // 获取预设值
      const preset = servicePresets[serviceName as keyof typeof servicePresets];

      // 获取当前表单值并合并预设
      const currentValues = form.getFieldsValue();
      const newValues = { ...currentValues, ...preset, serviceName };
      form.setFieldsValue(newValues);

      message.success(`已应用 ${serviceName} 的预设配置`);
    }
  };

  // 监听服务名称变化
  const handleServiceChange = (value: string) => {
    if (value && servicePresets[value as keyof typeof servicePresets]) {
      applyServicePreset(value);
    }
  };

  const steps = [
    {
      title: '基本信息',
      content: (
        <>
          <Form.Item
            name="serviceName"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Select placeholder="请选择服务名称" onChange={handleServiceChange} allowClear>
              {Object.keys(servicePresets).map(name => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
              <Option value="custom">自定义服务</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="environment"
            label="部署环境"
            rules={[{ required: true, message: '请选择部署环境' }]}
          >
            <Select placeholder="请选择部署环境">
              <Option value="dev">开发环境</Option>
              <Option value="test">测试环境</Option>
              <Option value="staging">预发环境</Option>
              <Option value="prod">生产环境</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如: v1.2.3" />
          </Form.Item>

          <Divider dashed />
          <Form.Item label="描述模板">
            <Space wrap>
              {Object.keys(descriptionTemplates).map(template => (
                <Tag
                  key={template}
                  color={selectedTemplate === template ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => applyTemplate(template)}
                >
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </Tag>
              ))}
            </Space>
          </Form.Item>

          <Form.Item
            name="description"
            label="部署描述"
            rules={[{ required: true, message: '请输入部署描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请简要描述此次部署的内容和目的"
              onChange={validateFields}
            />
          </Form.Item>

          {recentDeployments.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Divider orientation="left">
                <HistoryOutlined /> 最近部署
              </Divider>
              <Space direction="vertical" style={{ width: '100%' }}>
                {recentDeployments.map(deployment => (
                  <Alert
                    key={deployment.id}
                    message={
                      <Space>
                        <span>
                          <b>{deployment.serviceName}</b> ({deployment.version})
                        </span>
                        <Tag color={deployment.status === 'success' ? 'green' : 'red'}>
                          {deployment.status === 'success' ? '成功' : '失败'}
                        </Tag>
                      </Space>
                    }
                    description={`部署于 ${deployment.timestamp} 到 ${deployment.environment} 环境`}
                    type={deployment.status === 'success' ? 'success' : 'error'}
                    showIcon
                  />
                ))}
              </Space>
            </div>
          )}
        </>
      ),
    },
    {
      title: '代码配置',
      content: (
        <>
          <Form.Item
            name="repository"
            label="代码仓库"
            rules={[{ required: true, message: '请选择代码仓库' }]}
          >
            <Select placeholder="请选择代码仓库">
              <Option value="main-service">main-service</Option>
              <Option value="auth-service">auth-service</Option>
              <Option value="api-gateway">api-gateway</Option>
              <Option value="data-processor">data-processor</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="branch"
            label="分支"
            rules={[{ required: true, message: '请输入分支名称' }]}
          >
            <Input prefix={<BranchesOutlined />} placeholder="请输入分支名称" />
          </Form.Item>

          <Form.Item name="buildCommand" label="构建命令" initialValue="npm run build">
            <Input prefix={<CodeOutlined />} placeholder="例如: npm run build" />
          </Form.Item>

          <Form.Item
            name="useCache"
            label="使用构建缓存"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      title: '部署配置',
      content: (
        <>
          <Form.Item
            name="deploymentType"
            label="部署类型"
            initialValue="rolling"
            rules={[{ required: true, message: '请选择部署类型' }]}
          >
            <Radio.Group>
              <Radio.Button value="rolling">滚动部署</Radio.Button>
              <Radio.Button value="blue-green">蓝绿部署</Radio.Button>
              <Radio.Button value="canary">金丝雀部署</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="replicas"
            label="副本数"
            initialValue={2}
            rules={[{ required: true, message: '请输入副本数' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>

          <Form.Item
            name="cpu"
            label="CPU限制 (单位: 核)"
            initialValue={0.5}
            rules={[{ required: true, message: '请输入CPU限制' }]}
          >
            <InputNumber min={0.1} max={4} step={0.1} />
          </Form.Item>

          <Form.Item
            name="memory"
            label="内存限制 (单位: MB)"
            initialValue={512}
            rules={[{ required: true, message: '请输入内存限制' }]}
          >
            <InputNumber min={128} max={4096} step={128} />
          </Form.Item>

          <Form.Item
            name="autoRollback"
            label="自动回滚"
            valuePropName="checked"
            initialValue={true}
            tooltip="当部署失败时自动回滚到上一个版本"
          >
            <Switch />
          </Form.Item>
        </>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Card
      title="服务部署"
      extra={
        <Button type="link" icon={<InfoCircleOutlined />}>
          帮助文档
        </Button>
      }
    >
      <Steps
        current={current}
        items={steps.map(item => ({ key: item.title, title: item.title }))}
        style={{ marginBottom: 20 }}
      />

      <div style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            deploymentType: 'rolling',
            replicas: 2,
            cpu: 0.5,
            memory: 512,
            useCache: true,
            autoRollback: true,
            buildCommand: 'npm run build',
          }}
        >
          {/* 表单验证错误提示 */}
          {formErrors.length > 0 && (
            <Alert
              message="表单验证错误"
              description={
                <ul>
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              }
              type="error"
              style={{ marginBottom: 24 }}
              showIcon
            />
          )}

          {steps[current].content}

          <Divider />

          <Form.Item>
            <Space>
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={prev}>
                  上一步
                </Button>
              )}

              {current < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  下一步
                </Button>
              )}

              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  icon={<RocketOutlined />}
                  loading={loading}
                  htmlType="submit"
                >
                  提交部署
                </Button>
              )}

              <Button icon={<SaveOutlined />}>保存为草稿</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default DeploymentForm;
