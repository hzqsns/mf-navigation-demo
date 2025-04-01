import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { visualizer } from 'rollup-plugin-visualizer';
// 使用node内置的crypto模块
import * as crypto from 'crypto';

// 定义框架相关路径（类似Next.js的topLevelFrameworkPaths）
const frameworkPaths = ['react', 'react-dom', '@ant-design/pro-components', 'antd', 'scheduler'];

// 缓存模块依赖分析结果，避免重复计算
const cache = new Map<string, boolean>();

// 用于记录已分析的循环依赖组
const circularDependencyGroups = new Map<string, string>();

/**
 * 依赖关系分析函数 - 参考vite-plugin-chunk-split.ts
 * @param id 当前模块ID
 * @param targetPaths 目标依赖路径数组
 * @param importChain 导入链，用于检测循环依赖
 * @param getModuleInfo 获取模块信息的函数
 * @returns 是否包含目标依赖
 */
function isDepInclude(
  id: string,
  targetPaths: string[],
  importChain: string[] = [],
  getModuleInfo: (id: string) => any
): boolean {
  // 生成缓存键
  const key = `${id}-${targetPaths.join('|')}`;

  // 检测到循环依赖
  if (importChain.includes(id)) {
    cache.set(key, false);
    return false;
  }

  // 使用缓存优化性能
  if (cache.has(key)) {
    return cache.get(key) as boolean;
  }

  // 命中目标依赖
  if (targetPaths.some(path => id.includes(path))) {
    // 将导入链上的所有模块标记为依赖相关
    importChain.forEach(item => cache.set(`${item}-${targetPaths.join('|')}`, true));
    cache.set(key, true);
    return true;
  }

  // 获取模块信息
  const moduleInfo = getModuleInfo(id);
  if (!moduleInfo) {
    cache.set(key, false);
    return false;
  }

  // 递归分析导入的模块
  const imports = moduleInfo.importedIds || [];
  const newImportChain = [...importChain, id];

  const hasDependency = imports.some(importedId =>
    isDepInclude(importedId, targetPaths, newImportChain, getModuleInfo)
  );

  cache.set(key, hasDependency);
  return hasDependency;
}

/**
 * 计算项目中的总页面数
 * @param getModuleInfo 获取模块信息的函数
 * @returns 页面总数
 */
function getTotalPages(getModuleInfo: (id: string) => any): number {
  // 获取所有模块
  const allModuleIds = Array.from(getModuleInfo(null)?.getModuleIds() || []);

  // 找出所有页面模块(src/pages/下的模块)
  const pageModules = allModuleIds.filter(id => id.includes('/src/pages/'));

  // 返回页面总数，至少为1，避免除以0
  return Math.max(pageModules.length, 1);
}

/**
 * 判断模块是否为公共模块
 * 对应Next.js的commons组，采用minChunks: totalPages的判断方式
 * @param id 模块ID
 * @param getModuleInfo 获取模块信息的函数
 * @param totalPages 页面总数
 * @returns 是否为公共模块
 */
function isCommonModule(
  id: string,
  getModuleInfo: (id: string) => any,
  totalPages: number
): boolean {
  // 如果没有页面，则不可能是公共模块
  if (totalPages <= 0) return false;

  // 计算引用该模块的页面数量
  const pageImporters = new Set<string>();

  // 递归查找所有导入该模块的页面
  function collectPageImporters(moduleId: string, visited = new Set<string>()) {
    if (visited.has(moduleId)) return;
    visited.add(moduleId);

    // 如果当前模块是页面，添加到集合
    if (moduleId.includes('/src/pages/')) {
      const pagePath = moduleId.match(/\/src\/pages\/([^/]+)/)?.[1];
      if (pagePath) pageImporters.add(pagePath);
    }

    // 递归处理所有导入者
    const moduleInfo = getModuleInfo(moduleId);
    if (!moduleInfo || !moduleInfo.importers) return;

    for (const importer of moduleInfo.importers) {
      collectPageImporters(importer, visited);
    }
  }

  // 开始收集
  collectPageImporters(id);

  // 符合Next.js的commons逻辑：模块必须被所有页面使用
  return pageImporters.size >= totalPages;
}

export default defineConfig({
  // 指定部署时的基本路径
  base: '/',
  plugins: [
    // 添加React支持
    react(),
    // 使用visualizer插件分析打包体积
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false,
    }),
    // 模块联邦配置
    federation({
      // 当前应用名称
      name: 'host',
      // 远程模块配置
      remotes: {
        remote: {
          // 远程模块名称
          name: 'remote',
          // 远程模块入口地址
          entry: 'http://localhost:5001/mf-manifest.json',
        },
      },
      // 暴露给其他应用的模块
      exposes: {
        './App': './src/App',
      },
      // 共享依赖配置
      shared: {
        react: {
          // 确保应用间只加载一个React实例
          singleton: true,
          // 指定所需版本
          requiredVersion: '18.3.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '18.3.1',
        },
        antd: {
          singleton: true,
          requiredVersion: '5.22.2',
        },
        '@ant-design/pro-components': {
          singleton: true,
          requiredVersion: '2.8.0',
        },
      },
    }),
  ],
  resolve: {
    // 导入时可省略的扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    // 开发服务器端口
    port: 5002,
    // 监听所有地址
    host: true,
    // 指定开发服务器的源
    origin: 'http://localhost:5002',
    // 启用CORS
    cors: true,
    // 文件系统限制配置（已注释）
    // fs: {
    //   strict: false,
    //   allow: ['..'],
    // },
  },
  preview: {
    // 预览服务器端口
    port: 5002,
    // 监听所有地址
    host: true,
    // 如果端口被占用则报错，而不是尝试下一个可用端口
    strictPort: true,
  },
  build: {
    // 禁用模块预加载，避免与模块联邦冲突
    modulePreload: false,
    target: 'esnext',
    // 禁用代码压缩
    minify: false,
    // 禁用CSS代码分割
    cssCodeSplit: false,
    // 生成sourcemap
    sourcemap: true,
    // Rollup打包配置
    rollupOptions: {
      output: {
        // 入口文件输出格式
        entryFileNames: 'assets/[name].[hash].js',
        // 代码块输出格式
        chunkFileNames: 'assets/[name].[hash].js',
        // 资源文件输出格式
        assetFileNames: 'assets/[name].[hash].[ext]',

        // 参考Next.js的分包策略实现
        // manualChunks: (id, { getModuleInfo }) => {
        //   // 计算总页面数(只计算一次)
        //   const totalPages = getTotalPages(getModuleInfo);

        //   // 安全检查：排除可能与模块联邦冲突的模块
        //   if (
        //     id.includes('/__federation__/') ||
        //     id.includes('/__rf__/') ||
        //     id.includes('/@vite/') ||
        //     id.includes('/__mf__/')
        //   ) {
        //     return; // 让Vite默认处理
        //   }

        //   // 1. 核心入口文件 - 类似Next.js的chunks筛选器
        //   const coreEntryPattern =
        //     /\/(src\/main\.tsx|src\/bootstrap\.tsx|vite\/modulepreload-polyfill)$/;
        //   if (coreEntryPattern.test(id)) {
        //     return 'main'; // 保持核心入口完整，类似Next.js保留main和_app
        //   }

        //   // 2. 框架代码 - 类似Next.js的framework缓存组
        //   if (frameworkPaths.some(pkgPath => id.includes(pkgPath))) {
        //     return 'framework';
        //   }

        //   // 3. 检查模块是否参与循环依赖 - 使用vite-plugin-chunk-split的方法
        //   const importChain: string[] = [];
        //   if (id.includes('/src/') && isDepInclude(id, [id], importChain, getModuleInfo)) {
        //     // 找到循环依赖，将相关模块分到一组
        //     const groupName = `circular-${id.split('/').pop()}`;
        //     circularDependencyGroups.set(id, groupName);
        //     for (const chainModule of importChain) {
        //       if (chainModule !== id) {
        //         circularDependencyGroups.set(chainModule, groupName);
        //       }
        //     }
        //     return groupName;
        //   }

        //   // 4. 大型库 - 类似Next.js的lib缓存组
        //   if (id.includes('node_modules')) {
        //     try {
        //       const moduleInfo = getModuleInfo(id);
        //       const codeSize = moduleInfo?.code?.length || 0;

        //       // 直接使用Next.js的阈值160KB
        //       if (codeSize > 160000) {
        //         const hash = crypto.createHash('sha1');
        //         hash.update(id);
        //         return `lib-${hash.digest('hex').substring(0, 8)}`;
        //       }
        //     } catch (e) {
        //       // 安全处理
        //     }

        //     // 其他node_modules模块归入vendors
        //     return 'vendors';
        //   }

        //   // 5. 公共模块 - 类似Next.js的commons缓存组
        //   // 注意：采用与Next.js一致的逻辑，模块必须被所有页面使用
        //   if (id.includes('/src/') && isCommonModule(id, getModuleInfo, totalPages)) {
        //     return 'commons';
        //   }

        //   // 6. 按业务功能分组 - 这部分是Vite特有的
        //   if (id.includes('/src/features/') || id.includes('/src/components/')) {
        //     // 提取功能模块名
        //     const match = id.match(/\/src\/(features|components)\/([^/]+)/);
        //     if (match) {
        //       const [, type, name] = match;
        //       return `${type}-${name}`;
        //     }
        //   }

        //   // 7. 额外保护
        //   if (
        //     id.includes('node_modules/react') ||
        //     id.includes('node_modules/react-dom') ||
        //     id.includes('node_modules/scheduler')
        //   ) {
        //     return 'framework';
        //   }

        //   // 默认返回undefined，让Rollup决定
        //   return undefined;
        // },
      },
    },
    // 类似Next.js的minSize: 20000
    chunkSizeWarningLimit: 20000,
  },
});
