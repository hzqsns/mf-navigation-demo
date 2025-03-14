import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: {
          name: 'remote',
          entry: 'http://localhost:5001/mf-manifest.json',
        },
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
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
