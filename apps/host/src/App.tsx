import { ProLayout } from '@ant-design/pro-components';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import defaultProps from './defaultProps';

export default function App() {
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        {...defaultProps}
        location={{
          pathname,
        }}
        menuItemRender={(item, dom) => (
          <Link
            to={item.path || '/'}
            onClick={() => {
              setPathname(item.path || '/');
            }}
          >
             {dom}
          </Link>
        )}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
} 