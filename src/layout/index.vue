<template>
  <el-container direction="vertical">
    <Headerbar>
      <slot name="header" />
    </Headerbar>

    <el-container>
      <Asider width="320px">
        <slot name="asider" />
      </Asider>

      <Main>
        <slot />
      </Main>
    </el-container>
  </el-container>
</template>

<script>
import Asider from '@/layout/components/asider'
import Headerbar from '@/layout/components/header'
import Main from '@/layout/components/main'

export default {
  name: 'Layout',
  components: { Headerbar, Asider, Main },
}
</script>

<style lang="scss" scoped>
.el-container {
  --head-bar: 60px;
  height: 100%;
  .el-container {
    height: calc(100% - 60px);
  }
}
</style>
