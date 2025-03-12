import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

const RemoteApp = lazy(() => import('remote/App'));

export default function Remote() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <RemoteApp />
    </Suspense>
  );
} 