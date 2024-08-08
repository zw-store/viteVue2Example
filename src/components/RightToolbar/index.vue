<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-col :span="1.5">
        <slot></slot>
      </el-col>

      <el-col :span="1.5" class="!float-right">
        <el-tooltip effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
          <el-button size="mini" circle icon="el-icon-search" @click="$emit('update:showSearch', !showSearch)" />
        </el-tooltip>

        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="$emit('queryTable')" />
        </el-tooltip>

        <el-tooltip v-if="checkTableInfo.length" effect="dark" content="显隐列" placement="bottom-start">
          <el-popover v-model="visible" placement="right" trigger="click">
            <p class="clearfix">
              <i class="el-icon-refresh float-right cursor-pointer" @click="reset" />
            </p>

            <el-checkbox-group v-model="checks">
              <el-checkbox class="!block" v-for="item in checkTableInfo" :disabled="['selection', '操作'].includes(item)" :key="item" :label="item" />
            </el-checkbox-group>

            <el-divider class="!my-2.5" />

            <template>
              <el-button size="mini" type="primary" @click="submit(), (visible = false)">确定</el-button>
              <el-button v-if="componentName" size="mini" @click="cancel">取消</el-button>
            </template>

            <el-button class="!ml-2.5" slot="reference" size="mini" circle icon="el-icon-menu" />
          </el-popover>
        </el-tooltip>

        <el-tooltip effect="dark" content="列序重置" placement="top">
          <el-button class="!ml-2.5" size="mini" circle icon="el-icon-link" @click="resetCacheTableColumn" />
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { localstorageGet, localstorageSet } from '@/utils'
export const Key = 'ElTable'

export default {
  name: 'RightToolbar',
  data() {
    return {
      checks: Array.from(this.table.checkTableInfo?.filter(item => !this.table.hiddenColumns.includes(item)) || []),
      checkTableInfo: Array.from(this.table.checkTableInfo || []),
      visible: false,
    }
  },
  props: {
    showSearch: { type: Boolean, default: true },
    search: { type: Boolean, default: true },
    gutter: { type: Number, default: 10 },
    table: { type: Object, default: () => ({}) },
    componentName: { type: String, default: '' },
  },
  mounted() {
    if (!this.table.checkTableInfo) return

    const { componentName } = this
    const tableMap = localstorageGet(Key)
    let columns = this.rectifyHidden(tableMap, componentName)

    if (columns) {
      this.checks = this.table.checkTableInfo.filter(item => !columns.includes(item))
      localstorageSet(Key, tableMap)
    } else {
      columns = this.table.checkTableInfo.filter(item => !this.checks.includes(item))
    }

    this.$emit('interaction', columns)
  },
  methods: {
    rectifyHidden(tableMap, componentName) {
      tableMap.hidden = tableMap.hidden || {}
      tableMap.hidden[componentName] = tableMap.hidden[componentName] || this.table.hiddenColumns || []
      return tableMap.hidden[componentName]
    },
    rectifyDragger(tableMap, componentName) {
      tableMap.dragger = tableMap.dragger || {}
      tableMap.dragger[componentName] = tableMap.dragger[componentName] || []
      return tableMap.dragger[componentName]
    },
    submit() {
      if (!this.table.checkTableInfo) return

      const differs = this.table.checkTableInfo.filter(item => !this.checks.includes(item))
      this.$emit('interaction', differs)
      if (!this.componentName) return
      const tableMap = localstorageGet(Key)
      tableMap.hidden[this.componentName] = differs
      localstorageSet(Key, tableMap)
    },
    cancel() {
      if (!this.componentName || !this.table.checkTableInfo) return

      this.checks = this.table.checkTableInfo.filter(item => !this.table.hiddenColumns.includes(item))
      this.visible = false
    },
    reset() {
      if (!this.componentName || !this.table.checkTableInfo) return

      try {
        const originHiddenColumns = this.outerComponent?.$options.data().table?.hiddenColumns
        this.checks = this.table.checkTableInfo.filter(item => !originHiddenColumns.includes(item))
        this.submit()
      } catch (error) {
        console.info(error)
      }
    },
    resetCacheTableColumn() {
      const { componentName } = this
      const tableMap = localstorageGet(Key)
      const columns = this.rectifyDragger(tableMap, componentName)
      columns.splice(0, columns.length)
      localstorageSet(Key, tableMap)
      this.$message.success('表列顺序重置')
      this.$emit('sequence-reset')
    },
  },
  computed: {
    outerComponent() {
      if (!this.componentName) return null

      let parent = this.$parent
      while (parent && parent.$options.name !== this.componentName) {
        parent = parent.$parent
      }

      return parent
    },
    style() {
      const ret = {}
      if (this.gutter) {
        ret.marginRight = `${this.gutter / 2}px`
      }
      return ret
    },
  },
}
</script>

<style lang="scss" scoped>
.top-right-btn {
  margin: 2px 12px;
}
</style>
