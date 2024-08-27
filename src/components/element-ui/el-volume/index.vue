<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-23
 -->

<template>
  <div class="el-volume">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ElVolume',
}
</script>

<style lang="scss" scoped>
.el-volume {
  width: 100%;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  line-height: 18px;
  display: flex;
  & > :nth-child(n) {
    box-shadow:
      -4px 2px 6px 0px rgba(0, 0, 0, 0.1),
      -3px 2px 6px -1px rgba(0, 0, 0, 0.1),
      -2px 2px 4px -2px rgba(0, 0, 0, 0.1),
      -1px 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  :first-child {
    border-radius: 4px 0 0 4px;
    box-shadow:
      0px 6px 8px 0px rgba(0, 0, 0, 0.1),
      0px 4px 6px -1px rgba(0, 0, 0, 0.1),
      0px 2px 4px -2px rgba(0, 0, 0, 0.1),
      0px 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  :last-child {
    border-radius: 0 4px 4px 0;
  }
}
</style>
