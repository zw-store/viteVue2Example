<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2023-02-11
 -->

<template>
  <el-header>
    <slot />
  </el-header>
</template>

<script>
export default {
  name: 'HeaderModule',
}
</script>

<style lang="css" scoped>
.el-header {
  color: var(--el-text-color-primary);
  background-color: #d3dce6;
}
</style>
