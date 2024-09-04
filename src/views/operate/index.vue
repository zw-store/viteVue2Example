<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-02
 -->

<template>
  <div class="overflow-hidden">
    <div ref="parent" class="affix-container" style="height: 150vh">
      <el-button type="primary">Target container</el-button>
    </div>

    <div class="affix-container2 !bg-yellow-600" style="height: 150vh"></div>
    <div class="affix-container2 !bg-gray-600" style="height: 150vh"></div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.affix-container {
  border-radius: 4px;
  background: #adadad;
}
</style>
