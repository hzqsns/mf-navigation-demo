import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from './App';
import Remote from './pages/Remote';
import Welcome from './pages/Welcome';

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
      {
        path: '/remote',
        element: <Remote />,
      },
      {
        path: '*',
        element: <div>404 页面未找到</div>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
