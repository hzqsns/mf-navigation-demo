// import { PageContainer } from '@ant-design/pro-components';
// import { Spin } from 'antd';
// import React, { lazy, Suspense, useState, useEffect } from 'react';

// // 使用标准的动态导入语法，配合manifest格式
// // @ts-ignore - TypeScript不识别远程模块
// // const RemoteApp = lazy(() => import('remote/App'));

// const Remote: React.FC = () => {
//   const [hasError, setHasError] = useState(false);

//   // 添加错误处理逻辑
//   useEffect(() => {
//     const handleError = (event: ErrorEvent) => {
//       console.error('捕获到错误:', event.error);
//       if (event.error?.message?.includes('Federation Runtime')) {
//         setHasError(true);
//       }
//     };

//     window.addEventListener('error', handleError);
//     return () => window.removeEventListener('error', handleError);
//   }, []);

//   if (hasError) {
//     return (
//       <PageContainer title="远程应用">
//         <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
//           加载远程模块失败。请确保远程应用正在运行。
//         </div>
//       </PageContainer>
//     );
//   }

//   return (
//     <PageContainer title="远程应用">
//       <Suspense
//         fallback={
//           <div style={{ textAlign: 'center', padding: '50px 0' }}>
//             <Spin size="large" />
//           </div>
//         }
//       >
//         <RemoteApp />
//       </Suspense>
//     </PageContainer>
//   );
// };

// export default Remote;
