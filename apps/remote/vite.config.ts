import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      manifest: true,
      getPublicPath: `function() {return "http://localhost:5001/"}`,
      library: { type: 'var', name: 'remote' },
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {
          singleton: true,
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
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 5001,
    host: true,
    // origin: 'http://localhost:5001',
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // fs: {
    //   strict: false,
    //   allow: ['..'],
    // },
  },
  preview: {
    port: 5001,
    host: true,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        // 关键：不要为remoteEntry.js使用哈希
        entryFileNames: (chunkInfo) => {
          // 入口模块不使用哈希，确保稳定的引用点
          return 'assets/[name].js';
        },
        // 其他chunk使用内容哈希
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // 添加以下配置，确保每次构建后manifest内容更新
        manualChunks: undefined,
      },
    },
  },
});
