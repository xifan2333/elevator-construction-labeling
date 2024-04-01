<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '整体',
  },
}
</route>

<template>
  <view class="slab">
    <wd-form ref="form" :model="slab">
      <wd-input
        :label="t('slab.height')"
        type="digit"
        prop="height"
        :placeholder="t('slab.height.placeholder')"
        v-model="slab.height"
        clearable
        :rules="[{ required: true, message: t('slab.height.msg') }]"
      />
      <wd-input
        :label="t('slab.width')"
        type="digit"
        prop="width"
        :placeholder="t('slab.width.placeholder')"
        v-model="slab.width"
        clearable
        :rules="[{ required: true, message: t('slab.width.msg') }]"
      />
      <wd-input
        :label="t('slab.depth')"
        type="digit"
        prop="depth"
        :placeholder="t('slab.depth.placeholder')"
        v-model="slab.depth"
        clearable
        :rules="[{ required: true, message: t('slab.depth.msg') }]"
      />
      <view class="footer flex mt-4">
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('slab.preview')
        }}</wd-button>
        <wd-button type="success" block width="30%" @click="next">{{ t('slab.next') }}</wd-button>
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
import image from '@/static/images/slab.png'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { useStore } from '@/stores/store'
import { useToast } from 'wot-design-uni/components/wd-toast'
const { t } = useI18n()
const store = useStore()
const toast = useToast()
let ctx: any = null
let $canvas: any = null
let intervalId: any = null
let mode: string = ''
onLoad((query: any) => {
  mode = query.mode
})
const form = ref()
const slab = reactive({
  height: '',
  width: '',
  depth: '',
})
const preview = reactive({
  show: false,
  width: 300,
  height: 300,
  x: 0,
  y: 0,
})

const showPreview = () => {
  preview.show = true
  draw()
}
/**
 * 计算图片的位置和大小
 * */

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
 * 绘制画布
 */
const draw = () => {
  let device = uni.getSystemInfoSync()
  let $canvasWidth = device.windowWidth
  let $canvasHeight = device.windowHeight

  uni.getImageInfo({
    src: image,
    success: (res) => {
      if (ctx) {
        const { posX, posY, width, height } = calculateImagePositionAndSize(
          res.width,
          res.height,
          $canvasWidth,
          $canvasHeight,
        )
        ctx.drawImage(res.path, posX, posY, width, height)
        ctx.setFontSize(14)
        if (mode === 'new') {
          ctx.setFillStyle('red')
          ctx.fillText(slab.height, posX + (width / 24) * 1, posY + (height / 24) * 12)
          ctx.fillText(slab.width, posX + (width / 24) * 17, posY + (height / 24) * 23)
          ctx.fillText(slab.depth, posX + (width / 24) * 23, posY + (height / 24) * 12)
        }
        if (mode === 'edit') {
          let slabHeight = store.project.new.slab.height
          let slabWidth = store.project.new.slab.width
          let slabDepth = store.project.new.slab.depth
          ctx.setFillStyle('red')
          ctx.fillText(slabHeight, posX + (width / 24) * 1, posY + (height / 24) * 11)
          ctx.fillText(slabWidth, posX + (width / 24) * 17, posY + (height / 24) * 21)
          ctx.fillText(slabDepth, posX + (width / 24) * 23, posY + (height / 24) * 11)
          ctx.setFillStyle('blue')
          ctx.fillText(slab.height, posX + (width / 24) * 1, posY + (height / 24) * 13)
          ctx.fillText(slab.width, posX + (width / 24) * 17, posY + (height / 24) * 23)
          ctx.fillText(slab.depth, posX + (width / 24) * 23, posY + (height / 24) * 13)
        }
        ctx.draw()
      } else {
        console.log('ctx is null')
      }
    },
  })
}
/**
 * 当页面准备就绪时，执行以下操作：
 * 1. 设置定时器，每隔1.5秒执行一次回调函数
 * 2. 在回调函数中，使用uni.createSelectorQuery()获取canvas元素的信息，并将结果存储在$canvas变量中
 * 3. 使用uni.createCanvasContext()创建画布上下文对象，并将结果存储在ctx变量中
 * 4. 如果ctx和$canvas都存在，则清除定时器，清除画布上的内容，并调用draw()函数绘制新内容
 * 5. 如果ctx和$canvas不存在，则直接调用draw()函数绘制新内容
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
      ctx.clearRect(0, 0, $canvas.width, $canvas.height)
      draw()
    } else {
      draw()
    }
  }, 1500)
})
/**
 * 执行下一步操作
 */
const next = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.setSlab(slab, mode)
      store.saveProjects()
      toast.success(t('slab.submit.success'))
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/history',
        })
      }, 1000)
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style lang="css" scoped></style>
