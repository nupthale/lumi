import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@editor': path.resolve(__dirname, './src'),
      '@collection': path.resolve(__dirname, '../collection/src'),
      '~': path.resolve(__dirname, '../../shared'),
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ZSEditor',
      fileName: (format) => `editor.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'ant-design-vue', '@zsfe/zsui'],
      output: {
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'antd',
          '@zsfe/zsui': 'zsui',
        }
      }
    }
  }
})