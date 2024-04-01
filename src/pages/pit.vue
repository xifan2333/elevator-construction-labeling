<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '底坑',
  },
}
</route>

<template>
  <view class="pit">
    <wd-form ref="form" :model="pit">
      <wd-input
        :label="t('pit.height')"
        type="digit"
        prop="height"
        :placeholder="t('pit.height.placeholder')"
        v-model="pit.height"
        clearable
        :rules="[{ required: true, message: t('pit.height.msg') }]"
      />
      <wd-input
        :label="t('pit.width')"
        type="digit"
        prop="width"
        :placeholder="t('pit.width.placeholder')"
        v-model="pit.width"
        clearable
        :rules="[{ required: true, message: t('pit.width.msg') }]"
      />
      <wd-input
        :label="t('pit.depth')"
        type="digit"
        prop="depth"
        :placeholder="t('pit.depth.placeholder')"
        v-model="pit.depth"
        clearable
        :rules="[{ required: true, message: t('pit.depth.msg') }]"
      />
      <view class="footer flex mt-4">
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('pit.preview')
        }}</wd-button>
        <wd-button type="success" block width="30%" @click="next">{{ t('pit.next') }}</wd-button>
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
import image from '@/static/images/pit.png'
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
/**
 * 获取当前页面的模式，参数为new 或 edit，new 表示新建，edit 表示编辑即二次标注
  * @param query

 */
onLoad((query: any) => {
  mode = query.mode
})
const form = ref()
const pit = reactive({
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

/**
 * 显示预览
 */
const showPreview = () => {
  preview.show = true
  draw()
}

/**
 * 计算图片在画布中的位置和大小
 * @param {number} imgWidth - 图片的宽度
 * @param {number} imgHeight - 图片的高度
 * @param {number} canvasWidth - 画布的宽度
 * @param {number} canvasHeight - 画布的高度
 * @returns {object} - 包含图片在画布中的位置和大小的对象
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
 * 绘制画布
 * @returns {void}
 */

const draw = () => {
  // 获取设备的宽高
  let device = uni.getSystemInfoSync()
  let $canvasWidth = device.windowWidth
  let $canvasHeight = device.windowHeight
  // 获取图片宽高
  uni.getImageInfo({
    src: image,
    success: (res) => {
      if (ctx) {
        // 清空画布
        ctx.clearRect(0, 0, $canvasWidth, $canvasHeight)
        // 计算图片位置和大小
        const { posX, posY, width, height } = calculateImagePositionAndSize(
          res.width,
          res.height,
          $canvasWidth,
          $canvasHeight,
        )
        // 绘制图片
        ctx.drawImage(res.path, posX, posY, width, height)
        // 绘制文字
        ctx.setFontSize(14)
        // 如果是新建模式，绘制新建的坑的尺寸
        if (mode === 'new') {
          ctx.setFillStyle('red')
          ctx.fillText(pit.height, posX + (width / 24) * 1, posY + (height / 24) * 12)
          ctx.fillText(pit.width, posX + (width / 24) * 17.5, posY + (height / 24) * 22)
          ctx.fillText(pit.depth, posX + (width / 24) * 7.5, posY + (height / 24) * 22)
        }
        // 如果是编辑模式，绘制二次标注的底坑的尺寸及原始的底坑尺寸
        if (mode === 'edit') {
          let pitHeight = store.project.new.pit.height
          let pitWidth = store.project.new.pit.width
          let pitDepth = store.project.new.pit.depth
          ctx.setFillStyle('red')
          ctx.fillText(pitHeight, posX + (width / 24) * 1, posY + (height / 24) * 12)
          ctx.fillText(pitWidth, posX + (width / 24) * 17.5, posY + (height / 24) * 21)
          ctx.fillText(pitDepth, posX + (width / 24) * 7.5, posY + (height / 24) * 21)
          ctx.setFillStyle('blue')
          ctx.fillText(pit.height, posX + (width / 24) * 1, posY + (height / 24) * 15)
          ctx.fillText(pit.width, posX + (width / 24) * 17.5, posY + (height / 24) * 23)
          ctx.fillText(pit.depth, posX + (width / 24) * 7.5, posY + (height / 24) * 23)
        }
        ctx.draw()
      } else {
        console.log('ctx is null')
      }
    },
  })
}
/**
 * 当页面加载完成时，获取画布的宽高，并一定确保它加载到页面，如果没有就循环绘画
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
 * 下一步
 * 保存数据并跳转页面
 */

const next = () => {
  console.log(store.project)
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.setPit(pit, mode)
      toast.success(t('pit.submit.success'))
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/floor?mode=${mode}&id=${store.project.id}&begin_floor=${store.project.meta.begin}&current_floor=${store.project.meta.begin}&end_floor=${parseInt(store.project.meta.floors) + parseInt(store.project.meta.begin) - 1}`,
        })
      }, 1000)
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style lang="css" scoped></style>
