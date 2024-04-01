<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '整体',
  },
}
</route>

<template>
  <view class="intergral">
    <!-- 表单 -->
    <wd-form ref="form" :model="intergral">
      <!-- 地板下高度输入框 -->
      <wd-input
        :label="t('intergral.underSlabHeight')"
        type="digit"
        prop="underSlabHeight"
        :placeholder="t('intergral.underSlabHeight.placeholder')"
        v-model="intergral.underSlabHeight"
        clearable
        :rules="[{ required: true, message: t('intergral.underSlabHeight.msg') }]"
      />
      <!-- 电梯行程输入框 -->
      <wd-input
        :label="t('intergral.elevatorTrip')"
        type="digit"
        prop="elevatorTrip"
        :placeholder="t('intergral.elevatorTrip.placeholder')"
        v-model="intergral.elevatorTrip"
        clearable
        :rules="[{ required: true, message: t('intergral.elevatorTrip.msg') }]"
      />
      <!-- 坑道高度输入框 -->
      <wd-input
        :label="t('intergral.pitHeight')"
        type="digit"
        prop="pitHeight"
        :placeholder="t('intergral.pitHeight.placeholder')"
        v-model="intergral.pitHeight"
        clearable
        :rules="[{ required: true, message: t('intergral.pitHeight.msg') }]"
      />
      <!-- 底部按钮 -->
      <view class="footer flex mt-4">
        <!-- 预览按钮 -->
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('intergral.preview')
        }}</wd-button>
        <!-- 下一步按钮 -->
        <wd-button type="success" block width="30%" @click="next">{{
          t('intergral.next')
        }}</wd-button>
      </view>
    </wd-form>
    <!-- 预览图层 -->
    <wd-overlay :show="preview.show" @click="preview.show = false">
      <view class="flex justify-center items-center">
        <canvas id="canvas" canvas-id="canvas" class="h-screen w-screen" />
      </view>
    </wd-overlay>
    <!-- 提示框 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import image from '@/static/images/intergral.png'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { useStore } from '@/stores/store'
import { useToast } from 'wot-design-uni/components/wd-toast'

const { t } = useI18n()
const store = useStore()
const toast = useToast()

let ctx: any = null
let $canvas: any = null
let intervalId: any = null
let mode = ''

const form = ref()
const intergral = reactive({
  underSlabHeight: '',
  elevatorTrip: '',
  pitHeight: '',
})

const preview = reactive({
  show: false,
  width: 300,
  height: 300,
  x: 0,
  y: 0,
})

/**
 * 页面加载时的回调函数
 *
 * 用于获取页面参数。
 *
 * @param {Object} query - 页面参数
 */
onLoad((query: any) => {
  mode = query.mode
})

/**
 * 显示预览图层
 */
const showPreview = () => {
  preview.show = true
  draw()
}

/**
 * 计算图片位置和大小
 *
 * @param {number} imgWidth - 图片宽度
 * @param {number} imgHeight - 图片高度
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 * @returns {Object} - 图片位置和大小信息
 */
const calculateImagePositionAndSize = (
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) => {
  let posX = 0
  let posY = 0
  let width, height

  if (imgWidth < canvasWidth && imgHeight < canvasHeight) {
    // 图片的宽度和高度都小于 canvas 的宽度和高度，居中显示
    posX = 0.5 * canvasWidth - 0.5 * imgWidth
    posY = 0.5 * canvasHeight - 0.5 * imgHeight
    width = imgWidth
    height = imgHeight
  } else if (imgHeight / imgWidth > canvasHeight / canvasWidth) {
    // 图片的高宽比大于 canvas 的高宽比，按高度缩放并居中显示
    height = canvasHeight
    width = (imgWidth * canvasHeight) / imgHeight
    posX = 0.5 * canvasWidth - 0.5 * width
  } else {
    // 图片的高宽比小于或等于 canvas 的高宽比，按宽度缩放并居中显示
    width = canvasWidth
    height = (imgHeight * canvasWidth) / imgWidth
    posY = 0.5 * canvasHeight - 0.5 * height
  }

  return { posX, posY, width, height }
}

/**
 * 绘制预览图
 */
const draw = () => {
  let device = uni.getSystemInfoSync()
  let $canvasWidth = device.windowWidth
  let $canvasHeight = device.windowHeight

  uni.getImageInfo({
    src: image,
    success: (res) => {
      let { posX, posY, width, height } = calculateImagePositionAndSize(
        res.width,
        res.height,
        $canvasWidth,
        $canvasHeight,
      )
      ctx.drawImage(res.path, posX, posY, width, height)
      ctx.setFontSize(14)
      if (mode === 'new') {
        ctx.setFillStyle('red')
        ctx.fillText(intergral.underSlabHeight, posX + (width / 24) * 7, posY + (height / 24) * 4)
        ctx.fillText(intergral.elevatorTrip, posX + (width / 24) * 7, posY + (height / 24) * 16)
        ctx.fillText(intergral.pitHeight, posX + (width / 24) * 7, posY + (height / 24) * 21)
      }
      if (mode === 'edit') {
        ctx.setFillStyle('red')
        let underSlabHeight = store.project.new.intergral.underSlabHeight
        let elevatorTrip = store.project.new.intergral.elevatorTrip
        let pitHeight = store.project.new.intergral.pitHeight
        ctx.fillText(underSlabHeight, posX + (width / 24) * 7, posY + (height / 24) * 4)
        ctx.fillText(elevatorTrip, posX + (width / 24) * 7, posY + (height / 24) * 16)
        ctx.fillText(pitHeight, posX + (width / 24) * 7, posY + (height / 24) * 21)
        ctx.setFillStyle('blue')
        ctx.fillText(intergral.underSlabHeight, posX + (width / 24) * 7, posY + (height / 24) * 6)
        ctx.fillText(intergral.elevatorTrip, posX + (width / 24) * 7, posY + (height / 24) * 18)
        ctx.fillText(intergral.pitHeight, posX + (width / 24) * 7, posY + (height / 24) * 23)
      }
      ctx.draw()
    },
  })
}

/**
 * 页面准备完成时的回调函数
 *
 * 用于绘制预览图。
 */
onReady(() => {
  intervalId = setInterval(() => {
    uni
      .createSelectorQuery()
      .select('#canvas')
      .boundingClientRect()
      .exec((res) => {
        $canvas = res[0]
      })

    ctx = uni.createCanvasContext('canvas')
    if (ctx && $canvas) {
      clearInterval(intervalId)
      draw()
    } else {
      draw()
    }
  }, 1500)
})

/**
 * 下一步按钮点击事件处理函数
 *
 * 用于验证表单数据，并进行下一步操作。
 */
const next = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.setIntergral(intergral, mode)
      toast.success(t('intergral.submit.success'))
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/pit?mode=${mode}&id=${store.project.id}` })
      }, 1000)
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style lang="css" scoped></style>
