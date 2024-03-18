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
        :columns="meta.options"
        :label="t('meta.model')"
        :placeholder="t('meta.model.placeholder')"
        v-model="meta.model"
        :rules="[{ required: true, message: t('meta.model.msg') }]"
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
        :label="t('meta.site')"
        prop="site"
        :placeholder="t('meta.site.placeholder')"
        v-model="meta.site"
        clearable
        :rules="[{ required: true, message: t('meta.site.msg') }]"
      />
      <wd-input
        :label="t('meta.number')"
        :placeholder="t('meta.number.placeholder')"
        v-model="meta.number"
        prop="number"
        clearable
        :rules="[{ required: true, message: t('meta.number.msg') }]"
      />

      <wd-input
        :label="t('meta.person')"
        v-model="meta.person"
        prop="person"
        :placeholder="t('meta.person.placeholder')"
        clearable
        :rules="[{ required: true, message: t('meta.person.msg') }]"
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
import { reactive, toRaw, ref } from 'vue'
import { useStore } from '../stores/store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'wot-design-uni'
import { dayjs } from 'wot-design-uni'
const toast = useToast()
const { t } = useI18n()
const store = useStore()
const meta = reactive({
  model: '',
  floors: '',
  site: '',
  number: '',
  person: '',
  date: 0,
  options: ['modelA', 'modelB', 'modelC'],
})
const form = ref()
const confirmModel = ({ value }: { value: any }) => {
  meta.model = value
}
const dateFormate = (date: any) => {
  return dayjs(date).format('MM-YYYY-DD')
}
const confirmDate = ({ value }: { value: any }) => {
  meta.date = value
}
const submit = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      toast.success(t('meta.submit.success'))
      store.setMeta(meta)
      uni.navigateTo({ url: '/pages/first' })
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style>
/* 修复暗黑模式日历标签颜色 */
.wd-calendar__label {
  color: inherit !important;
  width: 500px;
}
</style>
