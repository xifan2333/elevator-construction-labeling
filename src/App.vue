<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {})
</script>

<style>
.wd-calendar__label {
  color: inherit !important;
}
.wot-theme-dark .wd-picker__placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf) !important;
}
.wd-calendar__value--placeholder {
  color: var(--wot-input-placeholder-color, #bfbfbf) !important;
}
.wot-theme-dark .wd-calendar__value {
  color: var(--wot-dark-color, var(--wot-color-white, rgb(255, 255, 255)));
}
page {
  height: 100%;
}
.defalut-layout {
  height: 100%;
  overflow: auto;
}
</style>
