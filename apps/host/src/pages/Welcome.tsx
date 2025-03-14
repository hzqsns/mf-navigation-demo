import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <PageContainer title="欢迎">
      <ProCard>
        <h1>欢迎使用微前端示例</h1>
        <p>这是一个使用 Module Federation 实现的微前端应用</p>
      </ProCard>
    </PageContainer>
  );
};

export default Welcome;
