import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
      } as any,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
