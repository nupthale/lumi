import { defineConfig } from 'vite';
import path from 'path'
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  build: {
    target: 'modules',
    // 打包文件目录
    outDir: 'es',
    // 压缩
    minify: false,
    // css分离
    // cssCodeSplit: true,
    rollupOptions: {
      // 只排除不需要打包的依赖
      external: ['vue', 'ant-design-vue', 'lottie-web-vue', 'lodash'],
      input: ['src/index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          // 移除 preserveModules，确保组件被正确编译
          preserveModules: true,
          dir: 'es',
          preserveModulesRoot: 'src',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: false,
          dir: 'lib',
          preserveModulesRoot: 'src',
        },
      ],
    },
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
    },
  },
  resolve: {
    alias: {
      '@collection': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, '../../shared'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      // 使用正确的属性名
      tsconfigPath: './tsconfig.json',
    }),
    // 使用正确的属性名
    dts({
      outDir: 'lib',
      tsconfigPath: './tsconfig.json',
    }),
  ],
});
