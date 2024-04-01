<template>
  <view class="bi">
    <!-- 表单 -->
    <wd-form ref="form" :model="bi">
      <!-- 高度输入框 -->
      <wd-input
        :label="t('bi.height')"
        type="digit"
        prop="height"
        :placeholder="t('bi.height.placeholder')"
        v-model="bi.height"
        clearable
        :rules="[{ required: true, message: t('bi.height.msg') }]"
      />
      <!-- 宽度输入框 -->
      <wd-input
        :label="t('bi.width')"
        type="digit"
        prop="width"
        :placeholder="t('bi.width.placeholder')"
        v-model="bi.width"
        clearable
        :rules="[{ required: true, message: t('bi.width.msg') }]"
      />
      <!-- 深度输入框 -->
      <wd-input
        :label="t('bi.depth')"
        type="digit"
        prop="depth"
        :placeholder="t('bi.depth.placeholder')"
        v-model="bi.depth"
        clearable
        :rules="[{ required: true, message: t('bi.depth.msg') }]"
      />
      <!-- 底部按钮 -->
      <view class="footer flex mt-4">
        <!-- 预览按钮 -->
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('bi.preview')
        }}</wd-button>
        <!-- 下一步按钮 -->
        <wd-button type="success" block width="30%" @click="next">{{ t('bi.next') }}</wd-button>
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

/** * @script * @lang ts * @setup * @description 页面逻辑脚本 */
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import image from '@/static/images/bi.png'
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

/**
 * @onLoad
 * @param {object} query - 页面参数
 * @description 页面加载时执行的函数，获取页面参数
 */
onLoad((query: any) => {
  mode = query.mode
})

const form = ref()

/**
 * @reactive
 * @description 表单数据
 */
const bi = reactive({
  height: '',
  width: '',
  depth: '',
})

/**
 * @reactive
 * @description 预览配置
 */
const preview = reactive({
  show: false,
  width: 300,
  height: 300,
  x: 0,
  y: 0,
})

/**
 * @function
 * @description 显示预览图层
 */
const showPreview = () => {
  preview.show = true
  draw()
}

/**
 * @function
 * @param {number} imgWidth - 图片宽度
 * @param {number} imgHeight - 图片高度
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 * @returns {object} - 图片位置和尺寸信息
 * @description 计算图片在画布中的位置和尺寸
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
 * @function
 * @description 绘制预览图
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
          ctx.fillText(bi.height, posX + (width / 24) * 5, posY + (height / 24) * 13)
          ctx.fillText(bi.width, posX + (width / 24) * 11, posY + (height / 24) * 14)
          ctx.fillText(bi.depth, posX + (width / 24) * 7, posY + (height / 24) * 5)
        }
        if (mode === 'edit') {
          let biHeight = store.project.new.bi.height
          let biWidth = store.project.new.bi.width
          let biDepth = store.project.new.bi.depth
          ctx.setFillStyle('red')
          ctx.fillText(biHeight, posX + (width / 24) * 5, posY + (height / 24) * 13)
          ctx.fillText(biWidth, posX + (width / 24) * 11, posY + (height / 24) * 14)
          ctx.fillText(biDepth, posX + (width / 24) * 7, posY + (height / 24) * 5)
          ctx.setFillStyle('blue')
          ctx.fillText(bi.height, posX + (width / 24) * 5, posY + (height / 24) * 15)
          ctx.fillText(bi.width, posX + (width / 24) * 11, posY + (height / 24) * 16)
          ctx.fillText(bi.depth, posX + (width / 24) * 7, posY + (height / 24) * 7)
        }
        ctx.draw()
      } else {
        console.log('ctx is null')
      }
    },
  })
}

/**
 * @onReady
 * @description 页面渲染完成时执行的函数
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
 * @function
 * @description 下一步操作
 */
const next = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.setBi(bi, mode)
      toast.success(t('bi.submit.success'))
      setTimeout(() => {
        uni.navigateTo({ url: `/pages/slab?mode=${mode}&id=${store.project.id}` })
      }, 1000)
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style lang="css" scoped></style>
