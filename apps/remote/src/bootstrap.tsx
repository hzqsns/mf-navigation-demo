import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 导出 App 组件以供Module Federation使用
export { default as App } from './App';

// 只有在独立运行时才渲染应用
// 当作为远程组件被引用时，这段代码不会执行
if (document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
