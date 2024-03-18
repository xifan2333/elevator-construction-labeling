<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'middle',
  },
}
</route>

<template>
  <view class="new">
    <wd-form ref="form" :model="meta">
      <wd-input
        :label="t('middleFloor.doorHeight')"
        type="digit"
        prop="doorHeight"
        :placeholder="t('middleFloor.doorHeight.placeholder')"
        v-model="middleFloor.doorHeight"
        clearable
        :rules="[{ required: true, message: t('middleFloor.doorHeight.msg') }]"
      />
      <wd-input
        :label="t('middleFloor.doorWidth')"
        type="digit"
        prop="doorWidth"
        :placeholder="t('middleFloor.doorWidth.placeholder')"
        v-model="middleFloor.doorWidth"
        clearable
        :rules="[{ required: true, message: t('middleFloor.doorWidth.msg') }]"
      />
      <wd-input
        :label="t('middleFloor.riserHeight')"
        type="digit"
        prop="riserHeight"
        :placeholder="t('middleFloor.riserHeight.placeholder')"
        v-model="middleFloor.riserHeight"
        clearable
        :rules="[{ required: true, message: t('middleFloor.riserHeight.msg') }]"
      />
      <view class="footer flex mt-4">
        <wd-button type="primary" size="middle" block width="30%">{{
          t('middleFloor.preview')
        }}</wd-button>
        <wd-button type="success" size="middle" block width="30%">{{
          t('middleFloor.next')
        }}</wd-button>
      </view>
    </wd-form>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const middleFloor = reactive({
  doorHeight: '',
  doorWidth: '',
  riserHeight: '',
})
</script>

<style lang="css" scoped></style>
