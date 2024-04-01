import un from '@uni-helper/uni-network'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

/**
 * 定义并导出一个名为 `useStore` 的函数，用于创建和管理项目的状态和操作。
 */
export const useStore = defineStore({
  id: 'project',
  state: () => ({
    /**
     * 项目的状态对象，包含以下属性：
     * - `project`: 当前项目的信息，默认为空对象。
     * - `currentTab`: 当前选项卡的名称，默认为 'new'。
     * - `projects`: 所有项目的列表，默认为空数组。
     */
    project: JSON.parse(uni.getStorageSync('project') || '{}'),
    currentTab: uni.getStorageSync('currentTab') || 'new',
    projects: JSON.parse(uni.getStorageSync('projects') || '[]'),
  }),
  actions: {
    /**
     * 重置项目状态，将 `project` 设置为空对象，并从存储中移除项目信息。
     */
    restProject() {
      this.project = {}
      uni.removeStorageSync('project')
    },
    /**
     * 设置项目的元数据，并生成一个唯一的项目 ID。
     * @param meta 项目的元数据。
     */
    setMeta(meta: any) {
      this.project.meta = meta
      this.project.id = uuidv4()
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置指定模式下的积分信息。
     * @param intergral 积分信息。
     * @param mode 模式名称。
     */
    setIntergral(intergral: any, mode: string) {
      if (!this.project[mode]) {
        this.project[mode] = {}
      }
      this.project[mode].intergral = intergral
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置指定模式下的坑道信息。
     * @param pit 坑道信息。
     * @param mode 模式名称。
     */
    setPit(pit: any, mode: string) {
      this.project[mode].pit = pit
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置指定模式下的楼层信息。
     * @param floor 楼层信息。
     * @param mode 模式名称。
     */
    setFloor(floor: any, mode: string) {
      this.project = JSON.parse(uni.getStorageSync('project') || '{}')
      if (!this.project[mode].floors) {
        this.project[mode].floors = []
      }
      this.project[mode].floors.push(floor)
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置指定模式下的 BI 信息。
     * @param bi BI 信息。
     * @param mode 模式名称。
     */
    setBi(bi: any, mode: string) {
      this.project[mode].bi = bi
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置指定模式下的板块信息。
     * @param slab 板块信息。
     * @param mode 模式名称。
     */
    setSlab(slab: any, mode: string) {
      this.project[mode].slab = slab
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 保存项目信息到项目列表中。
     * 如果项目已存在，则更新项目信息；否则，将项目添加到列表中。
     */
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
    /**
     * 删除指定 ID 的项目。
     * @param id 项目 ID。
     */
    deleteProject(id: string) {
      this.projects = this.projects.filter((project: any) => project.id !== id)
      uni.setStorageSync('projects', JSON.stringify(this.projects))
    },
    /**
     * 根据项目 ID 获取项目信息。
     * @param id 项目 ID。
     * @returns 匹配的项目信息，如果找不到则返回 `undefined`。
     */
    getProject(id: string) {
      return this.projects.find((project: any) => project.id === id)
    },
    /**
     * 设置当前选中的项目。
     * @param project 当前选中的项目。
     */
    setCurrentProject(project: any) {
      this.project = project
      uni.setStorageSync('project', JSON.stringify(this.project))
    },
    /**
     * 设置当前选中的选项卡。
     * @param tab 当前选中的选项卡名称。
     */
    setCurrentTab(tab: string) {
      this.currentTab = tab
      uni.setStorageSync('currentTab', this.currentTab)
    },
  },
})
