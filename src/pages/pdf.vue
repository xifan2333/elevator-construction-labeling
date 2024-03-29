<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'PDF导出',
  },
}
</route>

<template>
  <view class="pdf">
    <wd-cell :title="title" center class="mb-4">
      <wd-button size="small" type="success" @click="save">{{ t('pdf.btn.save') }}</wd-button>
    </wd-cell>
    <view class="canvas-wrapper" :style="`height:${canvasHeight}px`">
      <canvas type="2d" canvas-id="pdf-canvas" class="w-full h-full" id="pdf-canvas" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { useStore } from '@/stores/store'
import { dayjs } from 'wot-design-uni'
import imgIntergralTop from '@/static/images/intergral-top.png'
import imgIntergralBottom from '@/static/images/intergral-bottom.png'
import imgIntergralMiddle from '@/static/images/intergral-middle.png'
import imgPit from '@/static/images/pit.png'
import imgFloor from '@/static/images/floor.png'
import imgSlab from '@/static/images/slab.png'
import imgBi from '@/static/images/bi.png'
import jsPDF from 'jspdf'
const { t } = useI18n()
const store = useStore()
let ctx: any = null
let $canvas: any = null
let intervalId: any = null
const title = ref('')
const canvasHeight = ref(100)
const save = () => {
  const pdf = new jsPDF()
  uni.canvasToTempFilePath({
    canvasId: 'pdf-canvas',
    success: (res) => {
      pdf.addImage(res.tempFilePath, 'PNG', 0, 0, 210, 297)
      let base64 = pdf.output('datauristring').split(',')[1]

      uni.request({
        url: 'https://api.imgbb.com/1/upload?key=96bea9c3e0ead6a1810fc30d050bf435',
        method: 'POST',
        data: {
          image: base64,
          name: title.value,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },

        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          console.error(err)
        },
      })
    },
  })
}
onLoad((query: any) => {
  title.value = query.name
})
const getImageInfo = async (src: string) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
const draw = async () => {
  if (ctx) {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)
    await changeHeight()
    setTimeout(() => {
      console.log('等待画布高度计算完成')
    }, 2500)
    let imageIntergralTop = (await getImageInfo(imgIntergralTop)) as any
    let imageIntergralBottom = (await getImageInfo(imgIntergralBottom)) as any
    let imageIntergralMiddle = (await getImageInfo(imgIntergralMiddle)) as any
    let imagePit = (await getImageInfo(imgPit)) as any
    let imageFloor = (await getImageInfo(imgFloor)) as any
    let imageSlab = (await getImageInfo(imgSlab)) as any
    let imageBi = (await getImageInfo(imgBi)) as any
    if (
      imageIntergralTop &&
      imageIntergralBottom &&
      imageIntergralMiddle &&
      imagePit &&
      imageFloor &&
      imageSlab &&
      imageBi
    ) {
      let width = $canvas.width
      let height = (width / imageIntergralTop.width) * imageIntergralTop.height
      ctx.drawImage(imageIntergralTop.path, 0, 0, width, height)
      ctx.setFontSize(12)
      ctx.setFillStyle('black')
      try {
        ctx.fillText(
          `${t('meta.type')}:${store.project.meta.type}`,
          (width / 24) * 15,
          (height / 24) * 3,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('meta.id')}:${store.project.meta.id}`,
          (width / 24) * 15,
          (height / 24) * 7,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('meta.floors')}:${store.project.meta.floors}`,
          (width / 24) * 15,
          (height / 24) * 11,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('meta.site')}:${store.project.meta.site}`,
          (width / 24) * 15,
          (height / 24) * 15,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('meta.date')}:${dayjs(store.project.meta.date).format('MM-YYYY-DD')}`,
          (width / 24) * 15,
          (height / 24) * 19,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('meta.supervisor')}:${store.project.meta.supervisor}`,
          (width / 24) * 15,
          (height / 24) * 23,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('intergral.underSlabHeight')}:${store.project.new.intergral.underSlabHeight}`,
          (width / 24) * 2,
          (height / 24) * 8,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('intergral.underSlabHeight')}:${store.project.edit.intergral.underSlabHeight}`,
          (width / 24) * 2,
          (height / 24) * 12,
        )
      } catch (error) {
        console.error(error)
      }

      let y = height
      height = (width / imageIntergralMiddle.width) * imageIntergralMiddle.height
      for (let i = 0; i < parseInt(store.project.meta.floors) - 2; i++) {
        ctx.drawImage(imageIntergralMiddle.path, 0, y, width, height)
        y += height
      }
      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('intergral.elevatorTrip')}:${store.project.new.intergral.elevatorTrip}`,
          (width / 24) * 2,
          y - (height / 24) * 20,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('intergral.elevatorTrip')}:${store.project.edit.intergral.elevatorTrip}`,
          (width / 24) * 2,
          y - (height / 24) * 8,
        )
      } catch (error) {
        console.error(error)
      }
      height = (width / imageIntergralBottom.width) * imageIntergralBottom.height
      ctx.drawImage(imageIntergralBottom.path, 0, y, width, height)

      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('intergral.pitHeight')}:${store.project.new.intergral.pitHeight}`,
          (width / 24) * 2,
          y + (height / 24) * 5,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('intergral.pitHeight')}:${store.project.edit.intergral.pitHeight}`,
          (width / 24) * 2,
          y + (height / 24) * 13,
        )
      } catch (error) {
        console.error(error)
      }
      y += height
      // 底坑
      height = (width / imagePit.width) * imagePit.height
      ctx.drawImage(imagePit.path, 0, y, width, height)
      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('pit.height')}:${store.project.new.pit.height}`,
          (width / 24) * 0.5,
          y + (height / 24) * 12,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('pit.width')}:${store.project.new.pit.width}`,
          (width / 24) * 16,
          y + (height / 24) * 21,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('pit.depth')}:${store.project.new.pit.depth}`,
          (width / 24) * 5,
          y + (height / 24) * 21,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('pit.height')}:${store.project.edit.pit.height}`,
          (width / 24) * 0.5,
          y + (height / 24) * 14,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('pit.width')}:${store.project.edit.pit.width}`,
          (width / 24) * 16,
          y + (height / 24) * 23,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('pit.depth')}:${store.project.edit.pit.depth}`,
          (width / 24) * 5,
          y + (height / 24) * 23,
        )
      } catch (error) {
        console.error(error)
      }
      y += height
      // 楼层
      for (let i = 0; i < parseInt(store.project.meta.floors); i++) {
        height = (width / imageFloor.width) * imageFloor.height
        ctx.drawImage(imageFloor.path, 0, y, width, height)
        ctx.setFillStyle('red')
        try {
          ctx.fillText(
            `${t('floor.height')}:${store.project.new.floors[i].height}`,
            (width / 24) * 5,
            y + (height / 24) * 12,
          )
        } catch (error) {
          console.error(error)
        }
        try {
          ctx.fillText(
            `${t('floor.width')}:${store.project.new.floors[i].width}`,
            (width / 24) * 10,
            y + (height / 24) * 21,
          )
        } catch (error) {
          console.error(error)
        }
        try {
          ctx.fillText(
            `${t('floor.sillHeight')}:${store.project.new.floors[i].sillHeight}`,
            (width / 24) * 15,
            y + (height / 24) * 15,
          )
        } catch (error) {
          console.error(error)
        }
        ctx.setFillStyle('blue')
        try {
          ctx.fillText(
            `${t('floor.height')}:${store.project.edit.floors[i].height}`,
            (width / 24) * 5,
            y + (height / 24) * 14,
          )
        } catch (error) {
          console.error(error)
        }
        try {
          ctx.fillText(
            `${t('floor.width')}:${store.project.edit.floors[i].width}`,
            (width / 24) * 10,
            y + (height / 24) * 23,
          )
        } catch (error) {
          console.error(error)
        }
        try {
          ctx.fillText(
            `${t('floor.sillHeight')}:${store.project.edit.floors[i].sillHeight}`,
            (width / 24) * 15,
            y + (height / 24) * 17,
          )
        } catch (error) {
          console.error(error)
        }

        y += height
      }
      // BI
      height = (width / imageBi.width) * imageBi.height
      ctx.drawImage(imageBi.path, 0, y, width, height)

      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('bi.height')}:${store.project.new.bi.height}`,
          (width / 24) * 2,
          y + (height / 24) * 13,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('bi.width')}:${store.project.new.bi.width}`,
          (width / 24) * 12,
          y + (height / 24) * 15,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('bi.depth')}:${store.project.new.bi.depth}`,
          (width / 24) * 2,
          y + (height / 24) * 5,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('bi.height')}:${store.project.edit.bi.height}`,
          (width / 24) * 2,
          y + (height / 24) * 15,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('bi.width')}:${store.project.edit.bi.width}`,
          (width / 24) * 12,
          y + (height / 24) * 17,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('bi.depth')}:${store.project.edit.bi.depth}`,
          (width / 24) * 2,
          y + (height / 24) * 7,
        )
      } catch (error) {
        console.error(error)
      }
      y += height
      // 顶板
      height = (width / imageSlab.width) * imageSlab.height
      ctx.drawImage(imageSlab.path, 0, y, width, height)
      ctx.setFillStyle('red')
      try {
        ctx.fillText(
          `${t('slab.height')}:${store.project.new.slab.height}`,
          (width / 24) * 1,
          y + (height / 24) * 12,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('slab.width')}:${store.project.new.slab.width}`,
          (width / 24) * 14,
          y + (height / 24) * 21,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('slab.depth')}:${store.project.new.slab.depth}`,
          (width / 24) * 16,
          y + (height / 24) * 11,
        )
      } catch (error) {
        console.error(error)
      }
      ctx.setFillStyle('blue')
      try {
        ctx.fillText(
          `${t('slab.height')}:${store.project.edit.slab.height}`,
          (width / 24) * 1,
          y + (height / 24) * 14,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('slab.width')}:${store.project.edit.slab.width}`,
          (width / 24) * 14,
          y + (height / 24) * 23,
        )
      } catch (error) {
        console.error(error)
      }
      try {
        ctx.fillText(
          `${t('slab.depth')}:${store.project.edit.slab.depth}`,
          (width / 24) * 16,
          y + (height / 24) * 13,
        )
      } catch (error) {
        console.error(error)
      }

      y += height
      ctx.draw()
    }
  }
}
const changeHeight = async () => {
  if (ctx) {
    let imageIntergralTop = (await getImageInfo(imgIntergralTop)) as any
    let imageIntergralBottom = (await getImageInfo(imgIntergralBottom)) as any
    let imageIntergralMiddle = (await getImageInfo(imgIntergralMiddle)) as any
    let imagePit = (await getImageInfo(imgPit)) as any
    let imageFloor = (await getImageInfo(imgFloor)) as any
    let imageSlab = (await getImageInfo(imgSlab)) as any
    let imageBi = (await getImageInfo(imgBi)) as any
    if (
      imageIntergralTop &&
      imageIntergralBottom &&
      imageIntergralMiddle &&
      imagePit &&
      imageFloor &&
      imageSlab &&
      imageBi
    ) {
      let width = $canvas.width
      // ! 顶部 + 中间 + 底部 + 坑 + 楼层 + BI + Slab 计算画布高度
      canvasHeight.value = (width / imageIntergralTop.width) * imageIntergralTop.height
      canvasHeight.value +=
        parseInt(store.project.meta.floors) > 2
          ? (width / imageIntergralBottom.width) *
            imageIntergralMiddle.height *
            (parseInt(store.project.meta.floors) - 2)
          : imageIntergralMiddle.height
      canvasHeight.value += (width / imageIntergralBottom.width) * imageIntergralBottom.height
      canvasHeight.value += (width / imagePit.width) * imagePit.height
      canvasHeight.value +=
        (width / imageFloor.width) * imageFloor.height * parseInt(store.project.meta.floors)
      canvasHeight.value += (width / imageBi.width) * imageBi.height
      canvasHeight.value += (width / imageSlab.width) * imageSlab.height
    }
  }
}
onReady(async () => {
  intervalId = setInterval(async () => {
    uni
      .createSelectorQuery()
      .select('#pdf-canvas')
      .boundingClientRect()
      .exec((res) => {
        $canvas = res[0]
        console.log($canvas)
      })

    ctx = uni.createCanvasContext('pdf-canvas')
    if (ctx && $canvas) {
      clearInterval(intervalId)
      ctx.clearRect(0, 0, $canvas.width, $canvas.height)
      await draw()
    } else {
      ctx.clearRect(0, 0, $canvas.width, $canvas.height)
      await draw()
      console.log('waiting for canvas')
    }
  }, 1500)
})
</script>

<style lang="css" scoped></style>
