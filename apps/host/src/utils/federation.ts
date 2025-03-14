// 此文件已被禁用，我们现在使用vite.config.ts中的Module Federation配置
// 保留此文件只是为了避免潜在的导入错误

/**
 * 提供模块加载帮助函数（已弃用）
 * 请使用React.lazy(() => import('remote/App'))替代
 *
 * @deprecated 已弃用 - 请使用React.lazy
 */
export async function loadRemoteModule() {
  console.warn('此函数已弃用，请使用React.lazy(() => import("remote/App"))');
  throw new Error('此函数已弃用，请使用React.lazy(() => import("remote/App"))');
}
