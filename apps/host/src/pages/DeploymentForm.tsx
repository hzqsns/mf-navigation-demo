import React, { useState } from 'react';
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
} from 'antd';
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CodeOutlined,
  BranchesOutlined,
  SettingOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const DeploymentForm: React.FC = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: any) => {
    setLoading(true);
    console.log('提交的表单数据:', values);

    // 模拟提交
    setTimeout(() => {
      message.success('部署任务已提交成功！');
      setLoading(false);
    }, 1500);
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
            <Input placeholder="请输入服务名称" />
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

          <Form.Item
            name="description"
            label="部署描述"
            rules={[{ required: true, message: '请输入部署描述' }]}
          >
            <TextArea rows={4} placeholder="请简要描述此次部署的内容和目的" />
          </Form.Item>
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
