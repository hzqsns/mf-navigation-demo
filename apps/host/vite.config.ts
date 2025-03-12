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
          external: 'http://localhost:5001/remoteEntry.js',
          from: 'vite',
          externalType: 'url'
        }
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '18.3.1'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '18.3.1'
        },
        antd: {
          singleton: true,
          requiredVersion: '5.22.2'
        },
        '@ant-design/pro-components': {
          singleton: true,
          requiredVersion: '2.8.0'
        }
      }
    })
  ],
  server: {
    port: 5000
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
}); 