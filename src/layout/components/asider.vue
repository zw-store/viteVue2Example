<template>
  <el-aside :width="width">
    <Menu></Menu>
  </el-aside>
</template>

<script>
import Menu from '@/components/Menu'

export default {
  name: 'AsiderModule',
  props: {
    width: {
      type: String,
      default: '200px',
    },
  },
  components: {
    Menu,
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100%;
  color: var(--el-text-color-primary);
  background-color: #d3dce6;
}
</style>
