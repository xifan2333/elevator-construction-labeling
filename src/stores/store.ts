import un from '@uni-helper/uni-network'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useStore = defineStore({
  id: 'project',
  state: () => ({
    project: JSON.parse(uni.getStorageSync('project') || '{}'),
    currentTab: uni.getStorageSync('currentTab') || 'new',
    projects: JSON.parse(uni.getStorageSync('projects') || '[]'),
  }),
  actions: {
    restProject() {
      this.project = {}
      uni.removeStorageSync('project')
    },
    setMeta(meta: any) {
      this.project.meta = meta
      this.project.id = uuidv4()
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setIntergral(intergral: any, mode: string) {
      if (!this.project[mode]) {
        this.project[mode] = {}
      }
      this.project[mode].intergral = intergral
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setPit(pit: any, mode: string) {
      this.project[mode].pit = pit
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setFloor(floor: any, mode: string) {
      this.project = JSON.parse(uni.getStorageSync('project') || '{}')
      if (!this.project[mode].floors) {
        this.project[mode].floors = []
      }
      this.project[mode].floors.push(floor)
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setBi(bi: any, mode: string) {
      this.project[mode].bi = bi
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setSlab(slab: any, mode: string) {
      this.project[mode].slab = slab
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    saveProjects() {
      if (this.project.id) {
        const index = this.projects.findIndex((project: any) => project.id === this.project.id)
        if (index !== -1) {
          this.projects[index] = this.project
        } else {
          this.projects.push(this.project)
        }
        uni.setStorageSync('projects', JSON.stringify(this.projects))
      }
    },
    deleteProject(id: string) {
      this.projects = this.projects.filter((project: any) => project.id !== id)
      uni.setStorageSync('projects', JSON.stringify(this.projects))
    },
    getProject(id: string) {
      return this.projects.find((project: any) => project.id === id)
    },
    setCurrentProject(project: any) {
      this.project = project
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    setCurrentTab(tab: string) {
      this.currentTab = tab
      uni.setStorageSync('currentTab', this.currentTab)
    },
  },
})
