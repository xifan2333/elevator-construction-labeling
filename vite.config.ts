import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import wotDesignUni from './wot-design-uni.config'

export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: 'false',
    __VUE_I18N_LEGACY_API__: 'false',
    __INTLIFY_PROD_DEVTOOLS__: 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // https://github.com/uni-helper/vite-plugin-uni-pages
    UniPages({
      exclude: ['**/components/**/**.*'],
      routeBlockLang: 'json5',
      homePage: 'pages/index/index',
    }),
    // https://github.com/uni-helper/vite-plugin-uni-layouts
    UniLayouts(),
    // https://github.com/uni-helper/vite-plugin-uni-platform
    UniPlatform(),
    wotDesignUni,
    uni(),
    UnoCSS(),
    // https://github.com/uni-helper/vite-plugin-uni-middleware
    UniMiddleware(),
    // https://github.com/uni-helper/vite-plugin-uni-platform-modifier
    UniPlatformModifier(),
    // https://github.com/uni-helper/vite-plugin-uni-manifest
    UniManifest(),
  ],
  build: {
    target: 'es6',
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        format: 'es', // 或者 'cjs'
      },
    },
  },
  optimizeDeps: {
    exclude:
      process.env.UNI_PLATFORM === 'h5' && process.env.NODE_ENV === 'development'
        ? ['wot-design-uni', 'vue-demi']
        : ['vue-demi'],
  },
})
