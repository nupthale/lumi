import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import MotionResolver from 'motion-v/resolver'
import prefetchPlugin from 'vite-plugin-bundle-prefetch';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  // 不能加base， 要不然livestore的devtool会有问题 https://github.com/livestorejs/livestore/issues/395
  base: './',
  plugins: [
    vue(), 
    vueJsx(),
    Components({
      dts: true,
      resolvers: [
        MotionResolver()
      ],
    }),
    prefetchPlugin(),
    vueDevTools(),
  ],
  worker: { format: 'es' },
  build: {
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../../shared'),
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './src/api/api'),
      '@editor': path.resolve(__dirname, '../../packages/editor/src'),
      '@collection': path.resolve(__dirname, '../../packages/collection/src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
