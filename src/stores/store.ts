import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useStore = defineStore({
  id: 'project',
  state: () => ({
    project: {
      id: '',
      meta: {},
      floors: [],
    },
    currentTab: 'new',
  }),
  actions: {
    setMeta(meta: any) {
      this.project.id = uuidv4()
      this.project.meta = meta
    },
    setCurrentTab(tab: string) {
      this.currentTab = tab
    },
  },
})
