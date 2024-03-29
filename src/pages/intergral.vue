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
    <wd-form ref="form" :model="intergral">
      <wd-input
        :label="t('intergral.underSlabHeight')"
        type="digit"
        prop="underSlabHeight"
        :placeholder="t('intergral.underSlabHeight.placeholder')"
        v-model="intergral.underSlabHeight"
        clearable
        :rules="[{ required: true, message: t('intergral.underSlabHeight.msg') }]"
      />
      <wd-input
        :label="t('intergral.elevatorTrip')"
        type="digit"
        prop="elevatorTrip"
        :placeholder="t('intergral.elevatorTrip.placeholder')"
        v-model="intergral.elevatorTrip"
        clearable
        :rules="[{ required: true, message: t('intergral.elevatorTrip.msg') }]"
      />
      <wd-input
        :label="t('intergral.pitHeight')"
        type="digit"
        prop="pitHeight"
        :placeholder="t('intergral.pitHeight.placeholder')"
        v-model="intergral.pitHeight"
        clearable
        :rules="[{ required: true, message: t('intergral.pitHeight.msg') }]"
      />
      <view class="footer flex mt-4">
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('intergral.preview')
        }}</wd-button>
        <wd-button type="success" block width="30%" @click="next">{{
          t('intergral.next')
        }}</wd-button>
      </view>
    </wd-form>
    <wd-overlay :show="preview.show" @click="preview.show = false">
      <view class="flex justify-center items-center">
        <canvas id="canvas" canvas-id="canvas" class="h-screen w-screen" />
      </view>
    </wd-overlay>
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
onLoad((query: any) => {
  mode = query.mode
})
const showPreview = () => {
  preview.show = true
  draw()
}

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
