// 此文件已被禁用，我们现在使用vite.config.ts中的Module Federation配置
// 保留此文件只是为了避免潜在的导入错误

/**
 * Module Federation运行时配置（已弃用）
 * 所有配置已移至vite.config.ts
 */

// 这个文件中的运行时配置已被禁用，改为使用vite.config.ts中的构建插件配置
// import { init } from '@module-federation/enhanced/runtime';

// 初始化联邦运行时
// init({
//   name: 'remote',
//   remotes: [], // 初始化时不加载任何远程模块
//   shared: {
//     react: {
//       singleton: true,
//       requiredVersion: '18.3.1',
//     },
//     'react-dom': {
//       singleton: true,
//       requiredVersion: '18.3.1',
//     },
//     antd: {
//       singleton: true,
//       requiredVersion: '5.22.2',
//     },
//     '@ant-design/pro-components': {
//       singleton: true,
//       requiredVersion: '2.8.0',
//     },
//   },
// });

// 注意：此文件已不再需要，所有配置都已转移到vite.config.ts中
