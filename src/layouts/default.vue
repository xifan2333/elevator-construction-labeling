<template>
  <wd-config-provider :theme="theme">
    <view :class="darkMode">
      <view class="nav">
        <wd-navbar
          fixed
          placeholder
          safeAreaInsetTop
          :title="t('nav.title')"
          :left-text="t('nav.leftText')"
          :right-text="t('nav.rightText')"
          @click-left="changeTheme"
          @click-right="changeLanguage"
        >
          <template #left>
            <i :class="iconThemeColor" />
          </template>
          <template #right>
            <i :class="iconLanguageColor" />
          </template>
        </wd-navbar>
      </view>
      <view class="content flex-grow p-4">
        <wd-row>
          <wd-col :span="24"><slot></slot></wd-col>
        </wd-row>
      </view>
      <wd-action-sheet
        v-model="show"
        :actions="actions"
        @close="close"
        @select="select"
        :z-index="100"
      />
      <view class="tabbar">
        <wd-tabbar
          fixed
          bordered
          safeAreaInsetBottom
          placeholder
          active-color="#ff6f00"
          inactive-color="#888888"
          @change="changeTab"
          v-model="currentTab"
        >
          <wd-tabbar-item icon="file-add" :title="t('tabbar.new')" name="new"> </wd-tabbar-item>
          <wd-tabbar-item
            icon="history"
            :title="t('tabbar.history')"
            name="history"
          ></wd-tabbar-item>
        </wd-tabbar>
      </view>
    </view>
  </wd-config-provider>
</template>
<script lang="ts" setup>
import { toRefs, reactive, ref, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from '../stores/store'
const store = useStore()
const { proxy } = getCurrentInstance() as any
const { t } = useI18n()
const isDark = ref(false)
const state = reactive({
  isDark: false,
  get darkMode() {
    return isDark.value ? 'h-dvh bg-dark1 text-gray-1' : 'h-dvh bg-light1 text-gray-9'
  },
  get iconThemeColor() {
    return isDark.value
      ? 'i-mdi:theme-light-dark text-orange-2'
      : 'i-mdi:theme-light-dark text-blue-500 '
  },
  get iconLanguageColor() {
    return isDark.value ? 'i-mdi:earth text-pink-2' : 'i-mdi:earth text-green-500'
  },
  toggleTheme() {
    isDark.value = !isDark.value
  },
  theme: 'light' as 'light' | 'dark',
  actions: [{ name: '中文' }, { name: 'English' }, { name: 'Français' }] as any,
  show: false,
  currentTab: 'new',
})
const { theme, iconThemeColor, iconLanguageColor, darkMode, show, actions, currentTab } =
  toRefs(state)
const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  isDark.value = !isDark.value
}
const changeLanguage = () => {
  show.value = true
}
const close = () => {
  show.value = false
}
const select = (item: any) => {
  const index = item.index
  switch (index) {
    case 0:
      proxy.$i18n.locale = 'zh-Hans'
      break
    case 1:
      proxy.$i18n.locale = 'en'
      break
    case 2:
      proxy.$i18n.locale = 'fr'
      break
  }
  uni.setLocale(proxy.$i18n.locale)
  show.value = false
}
const changeTab = ({ value }) => {
  store.setCurrentTab(value)
  switch (value) {
    case 'new':
      uni.navigateTo({ url: '/pages/new' })
      break
    case 'history':
      uni.navigateTo({
        url: '/pages/history',
      })
      break
    default:
      break
  }
}
onLoad(() => {
  currentTab.value = store.currentTab
})
</script>
<style scoped></style>
