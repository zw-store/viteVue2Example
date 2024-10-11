/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import EslintPlugin from 'vite-plugin-eslint'
import vue2Plugin from '@vitejs/plugin-vue2'
import vue2JsxPlugin from '@vitejs/plugin-vue2-jsx'
import { viteMockServe } from 'vite-plugin-mock'

import VitePluginBuildLegacy, { GeneratVersion } from './vite-plugin-build-legacy'
import { clearScreen, createColors } from './cli-helper'

const colors = createColors()

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())

  const { VITE_APP_ENV } = env

  return {
    root: process.cwd(),
    // mode: 'development',
    base: VITE_APP_ENV === 'production' ? './' : '/',
    server: {
      port: 10001,
      host: true,
      cors: true,
      proxy: {
        [env.VITE_API_PREFIX]: {
          target: 'https://example:port',
          ws: false,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${env.VITE_API_PREFIX}`), ''),
          configure: proxy => {
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              clearScreen()
              console.log(colors.bgYellow(`  ${req.method}  `), colors.green(`${proxy.options.target}${req.url}`))
            })
            proxy.on('error', (_err, req, _res) => {
              console.log(colors.bgRed(`Error：${req.method}  `), colors.green(`${proxy.options.target}${req.url}`))
            })
          },
        },
      },
    },
    build: {
      outDir: 'dist-examples',
      sourcemap: true,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
          manualChunks: {
            lodash: ['lodash-es'],
            axios: ['axios'],
            'vue-vendor': ['vue'],
            'element-ui': ['element-ui'],
          },
          chunkFileNames() {
            return `assets/js/[name].[hash].js`
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.vue', '.js', '.jsx', '.json'],
    },
    define: {
      appVersion: JSON.stringify(GeneratVersion()),
    },
    plugins: [
      vue2Plugin(),
      vue2JsxPlugin(),
      ViteEjsPlugin({ title: 'vite-example' }),
      EslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.jsx'],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: command === 'build',
      }),
      viteMockServe({
        mockPath: resolve('__dirname', 'mock'),
        localEnabled: true,
      }),
      VitePluginBuildLegacy(),
    ],
    optimizeDeps: {
      include: ['vue', 'sass', 'axios', 'dayjs', 'lodash-es', 'element-ui', '@fullcalendar/*'],
      exclude: [],
    },
  }
})
