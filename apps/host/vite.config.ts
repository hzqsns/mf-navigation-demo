import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false,
    }),
    federation({
      name: 'host',
      remotes: {
        remote: {
          name: 'remote',
          entry: 'http://localhost:5001/mf-manifest.json',
        },
      },
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
    port: 5002,
    host: true,
    origin: 'http://localhost:5002',
    cors: true,
    // fs: {
    //   strict: false,
    //   allow: ['..'],
    // },
  },
  preview: {
    port: 5002,
    host: true,
    strictPort: true,
  },
  build: {
    modulePreload: true,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
