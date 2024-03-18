import { createSSRApp } from 'vue'
import 'core-js/actual/array/iterator'
import 'core-js/actual/promise'
import 'core-js/actual/object/assign'
import 'core-js/actual/promise/finally'
import 'uno.css'
import { createI18n } from 'vue-i18n'
import * as Pinia from 'pinia'
import App from './App.vue'
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'
import fr from '@/locales/fr.json'
import { Locale } from 'wot-design-uni'
import enUS from 'wot-design-uni/locale/lang/en-US'
Locale.use('en-US', enUS)
const messages = {
  en,
  fr,
  'zh-Hans': zh,
}
let i18nConfig = {
  legacy: false,
  locale: uni.getLocale(), // 获取已设置的语言
  messages,
}
const i18n = createI18n(i18nConfig)
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.use(i18n)
  return {
    app,
    Pinia,
  }
}
