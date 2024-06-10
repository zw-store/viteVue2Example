<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2023-02-11
 -->

<template>
  <el-main>
    <slot />
  </el-main>
</template>

<script>
export default {
  name: 'MainModule',
}
</script>

<style lang="css" scoped>
.el-main {
  background-color: #e9eef3;
  --el-main-padding: 0;
  position: relative;
  height: 100%;
}
</style>
