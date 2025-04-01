import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from './App';
import Remote from './pages/Remote';
import Welcome from './pages/Welcome';
import ServiceList from './pages/ServiceList';
import DeploymentForm from './pages/DeploymentForm';
import MonitorDashboard from './pages/MonitorDashboard';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '/welcome',
        element: <Welcome />,
      },
      // {
      //   path: '/remote',
      //   element: <Remote />,
      // },
      {
        path: '/services',
        element: <ServiceList />,
      },
      {
        path: '/deployment',
        element: <DeploymentForm />,
      },
      {
        path: '/monitor',
        element: <MonitorDashboard />,
      },
      {
        path: '*',
        element: <div>404 页面未找到</div>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
