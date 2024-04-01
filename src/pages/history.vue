<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '历史',
  },
}
</route>

<template>
  <view class="history">
    <wd-search v-model="search" @search="searchHistory" hide-cancel @clear="fetchHistory" />
    <view class="historyList mt-4">
      <wd-card :title="`TK Elevator ${item.meta.id}`" v-for="item in history" :key="item.id">
        <template #footer>
          <wd-button type="success" size="small" @click="edit(item)">{{
            t('history.btn.edit')
          }}</wd-button>
          <wd-button type="primary" class="ml-2" size="small" @click="_export(item)">{{
            t('history.btn.export')
          }}</wd-button>
          <wd-button type="error" class="ml-2" size="small" @click="_delete(item)">{{
            t('history.btn.delete')
          }}</wd-button>
        </template>
      </wd-card>
      <wd-toast id="toast" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni/components/wd-toast'

const toast = useToast()
const store = useStore()
const { t } = useI18n()
const history = ref([] as any[])
const search = ref('')

/**
 * 加载历史记录
 */
onLoad(() => {
  fetchHistory()
})

/**
 * 获取历史记录
 */
const fetchHistory = () => {
  history.value = store.projects
}

/**
 * 编辑历史记录
 *
 * @param item - 要编辑的历史记录项
 */
const edit = (item: any) => {
  store.setCurrentProject(item)
  uni.navigateTo({ url: `/pages/intergral?mode=edit&id=${item.id}` })
}

/**
 * 导出历史记录
 *
 * @param item - 要导出的历史记录项
 */
const _export = (item: any) => {
  store.setCurrentProject(item)
  uni.navigateTo({ url: `/pages/pdf?id=${item.id}&name=TK_Elevator_${item.meta.id}.pdf` })
}

/**
 * 删除历史记录
 *
 * @param item - 要删除的历史记录项
 */
const _delete = (item: any) => {
  store.deleteProject(item.id)
  toast.success(t('history.delete.success'))
  fetchHistory()
}

/**
 * 搜索历史记录
 */
const searchHistory = () => {
  history.value = store.projects.filter((item: any) => item.meta.id.includes(search.value))
}
</script>

<style lang="css" scoped></style>
