<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '新建',
  },
}
</route>

<template>
  <view class="new">
    <wd-form ref="form" :model="meta">
      <wd-picker
        :columns="options"
        :label="t('meta.type')"
        :placeholder="t('meta.type.placeholder')"
        v-model="meta.type"
        :rules="[{ required: true, message: t('meta.type.msg') }]"
        @confirm="confirmModel"
        :z-index="100"
      />
      <wd-input
        :label="t('meta.floors')"
        type="digit"
        prop="floors"
        :placeholder="t('meta.floors.placeholder')"
        v-model="meta.floors"
        clearable
        :rules="[{ required: true, message: t('meta.floors.msg') }]"
      />
      <wd-input
        :label="t('meta.begin')"
        type="digit"
        prop="begin"
        :placeholder="t('meta.begin.placeholder')"
        v-model="meta.begin"
        clearable
        :rules="[{ required: true, message: t('meta.begin.msg') }]"
      />
      <wd-input
        :label="t('meta.site')"
        prop="site"
        :placeholder="t('meta.site.placeholder')"
        v-model="meta.site"
        clearable
        :rules="[{ required: true, message: t('meta.site.msg') }]"
      />
      <wd-input
        :label="t('meta.id')"
        :placeholder="t('meta.id.placeholder')"
        v-model="meta.id"
        prop="id"
        clearable
        :rules="[{ required: true, message: t('meta.id.msg') }]"
      />

      <wd-input
        :label="t('meta.supervisor')"
        v-model="meta.supervisor"
        prop="supervisor"
        :placeholder="t('meta.supervisor.placeholder')"
        clearable
        :rules="[{ required: true, message: t('meta.supervisor.msg') }]"
      />
      <wd-calendar
        v-model="meta.date"
        :label="t('meta.date')"
        :display-format="dateFormate"
        :placeholder="t('meta.date.placeholder')"
        @confirm="confirmDate"
        :rules="[{ required: true, message: t('meta.date.msg') }]"
        :z-index="100"
      />

      <view class="footer mt-4">
        <wd-button type="primary" size="large" @click="submit" block>{{
          t('meta.submit')
        }}</wd-button>
      </view>
    </wd-form>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useStore } from '@/stores/store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'wot-design-uni'
import { dayjs } from 'wot-design-uni'
const toast = useToast()
const { t } = useI18n()
const store = useStore()
// 要填写的表单数据，与界面双向绑定
const meta = reactive({
  type: '',
  floors: '',
  begin: '',
  site: '',
  id: '',
  supervisor: '',
  date: 0,
})
const options = ref(['typeA', 'typeB', 'typeC'])
const form = ref()
const confirmModel = ({ value }: { value: any }) => {
  meta.type = value
}

/**
 * 格式化日期
 * @param {any} date - 要格式化的日期
 * @returns {string} - 格式化后的日期字符串
 */
const dateFormate = (date: any) => {
  return dayjs(date).format('MM-YYYY-DD')
}
/**
 * 确认日期
 * @param {Object} value - 日期值
 */
const confirmDate = ({ value }: { value: any }) => {
  meta.date = value
}
/**
 * 提交表单

 * @returns {void}
 */
const submit = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.restProject()
      store.setMeta(meta)
      toast.success(t('meta.submit.success'))
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/intergral?mode=new&id=${store.project.id}` })
      }, 1000)
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style></style>
