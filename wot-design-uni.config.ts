import Components, { kebabCase } from '@uni-helper/vite-plugin-uni-components'

const wotDesignUni = Components({
  resolvers: [
    {
      type: 'component',
      resolve: (name: string) => {
        if (name.match(/^Wd[A-Z]/)) {
          const compName = kebabCase(name)
          return {
            name,
            from: `wot-design-uni/components/${compName}/${compName}.vue`,
          }
        }
      },
    },
  ],
})

export default wotDesignUni
