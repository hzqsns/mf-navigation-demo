import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown, theme } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import MenuCard from './components/MenuCard';
import SearchInput from './components/SearchInput';
import defaultProps from './defaultProps';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pathname, setPathname] = useState(location.pathname);

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <ProLayout
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            title="微前端示例"
            {...defaultProps}
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: '用户',
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
                          label: '退出登录',
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={props => {
              if (props.isMobile) return [];
              if (typeof window === 'undefined') return [];
              return [
                props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                  <SearchInput key="SearchInput" />
                ) : undefined,
                <InfoCircleFilled key="InfoCircleFilled" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
                <QuestionCircleFilled key="QuestionCircleFilled" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
                <GithubFilled key="GithubFilled" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
              ];
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return (
                <>
                  {defaultDom}
                  <MenuCard />
                </>
              );
            }}
            menuFooterRender={props => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2024 微前端示例</div>
                  <div>Module Federation</div>
                </div>
              );
            }}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  // 处理外部链接
                  if (item.path?.startsWith('http')) {
                    window.open(item.path);
                    return;
                  }
                  // 处理内部路由
                  if (item.path) {
                    navigate(item.path);
                    setPathname(item.path);
                  }
                }}
              >
                {dom}
              </div>
            )}
            menuProps={{
              onClick: menu => {
                if (menu.key) {
                  const path = menu.key.toString();
                  if (!path.startsWith('http')) {
                    setPathname(path);
                  }
                }
              },
            }}
            onMenuHeaderClick={() => navigate('/')}
            fixSiderbar
            layout="mix"
            splitMenus={true}
          >
            <Outlet />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default App;