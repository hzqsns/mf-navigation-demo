export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/remote',
        name: '子应用',
        icon: 'crown',
        component: './Remote',
      },
    ],
  },
  location: {
    pathname: '/',
  },
  title: '微前端示例',
}; 