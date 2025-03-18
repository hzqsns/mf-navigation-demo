import React from 'react';
import { ProCard } from '@ant-design/pro-components';

export default function App() {
  return (
    <div>
      <ProCard title="子应用">
        <p>这是一个使用 Module Federation 加载的子应用</p>
      </ProCard>
    </div>
  );
}
