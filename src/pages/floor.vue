<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '楼层',
  },
}
</route>

<template>
  <!-- 页面模板 -->
  <view class="floor">
    <wd-cell :title="t('floor.title')" :value="`(${currentFloor}/${endFloor})`" />
    <wd-form ref="form" :model="floor">
      <!-- 输入框组件 -->
      <wd-input
        :label="t('floor.height')"
        type="digit"
        prop="height"
        :placeholder="t('floor.height.placeholder')"
        v-model="floor.height"
        clearable
        :rules="[{ required: true, message: t('floor.height.msg') }]"
      />
      <wd-input
        :label="t('floor.width')"
        type="digit"
        prop="width"
        :placeholder="t('floor.width.placeholder')"
        v-model="floor.width"
        clearable
        :rules="[{ required: true, message: t('floor.width.msg') }]"
      />
      <wd-input
        :label="t('floor.sillHeight')"
        type="digit"
        prop="sillHeight"
        :placeholder="t('floor.sillHeight.placeholder')"
        v-model="floor.sillHeight"
        clearable
        :rules="[{ required: true, message: t('floor.sillHeight.msg') }]"
      />
      <view class="footer flex mt-4">
        <!-- 按钮组件 -->
        <wd-button type="primary" block width="30%" @click="showPreview">{{
          t('floor.preview')
        }}</wd-button>
        <wd-button type="success" block width="30%" @click="next">{{ t('floor.next') }}</wd-button>
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
import image from '@/static/images/floor.png'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { useStore } from '@/stores/store'
import { useToast } from 'wot-design-uni/components/wd-toast'

// 使用国际化
const { t } = useI18n()

// 使用全局状态
const store = useStore()

// 使用 Toast 组件
const toast = useToast()

// 定义变量
let beginFloor = 0
let currentFloor = 0
let endFloor = 0
let ctx: any = null
let $canvas: any = null
let intervalId: any = null
let mode: string = ''
let id: string = ''

// 定义响应式数据
const form = ref()
const floor = reactive({
  height: '',
  width: '',
  sillHeight: '',
})
const preview = reactive({
  show: false,
  width: 300,
  height: 300,
  x: 0,
  y: 0,
})

// 显示预览
const showPreview = () => {
  preview.show = true
  draw()
}

// 计算图片位置和大小
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

// 绘制画布
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
          ctx.fillText(floor.height, posX + (width / 24) * 7, posY + (height / 24) * 12)
          ctx.fillText(floor.width, posX + (width / 24) * 12, posY + (height / 24) * 22)
          ctx.fillText(floor.sillHeight, posX + (width / 24) * 17, posY + (height / 24) * 17)
        }
        if (mode === 'edit') {
          let floorHeight = store.project.new.floors[currentFloor - beginFloor].height
          let floorWidth = store.project.new.floors[currentFloor - beginFloor].width
          let floorSillHeight = store.project.new.floors[currentFloor - beginFloor].sillHeight
          ctx.setFillStyle('red')
          ctx.fillText(floorHeight, posX + (width / 24) * 7, posY + (height / 24) * 12)
          ctx.fillText(floorWidth, posX + (width / 24) * 12, posY + (height / 24) * 21)
          ctx.fillText(floorSillHeight, posX + (width / 24) * 17, posY + (height / 24) * 17)
          ctx.setFillStyle('blue')
          ctx.fillText(floor.height, posX + (width / 24) * 7, posY + (height / 24) * 15)
          ctx.fillText(floor.width, posX + (width / 24) * 12, posY + (height / 24) * 23)
          ctx.fillText(floor.sillHeight, posX + (width / 24) * 17, posY + (height / 24) * 19)
        }
        ctx.draw()
      } else {
        console.log('ctx is null')
      }
    },
  })
}

// 页面加载完成时执行
onLoad((query: any) => {
  beginFloor = parseInt(query.begin_floor)
  currentFloor = parseInt(query.current_floor)
  endFloor = parseInt(query.end_floor)
  mode = query.mode
  id = query.id
})

// 页面渲染完成时执行
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

// 下一步操作
const next = () => {
  form.value.validate().then(({ valid, error }: { valid: boolean; error: any }) => {
    if (valid) {
      store.setFloor(floor, mode)
      if (currentFloor < endFloor) {
        toast.success(t('floor.nextfloor.success'))
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/floor?mode=${mode}&id=${store.project.id}&begin_floor=${store.project.meta.begin}&current_floor=${currentFloor + 1}&end_floor=${endFloor}`,
          })
        }, 1000)
      } else {
        toast.success(t('floor.submit.success'))
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/bi?mode=${mode}&id=${store.project.id}`,
          })
        }, 1000)
      }
    } else {
      console.log('error', error)
    }
  })
}
</script>

<style lang="css" scoped></style>
