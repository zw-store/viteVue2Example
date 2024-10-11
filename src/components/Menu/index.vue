<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-06-09
 -->

<template>
  <el-menu
    :collapse="isCollapse"
    router
    unique-opened
    collapse-transition
    :default-active="activeMenu"
    :text-color="textColor"
    :background-color="backgroundColor"
    :active-text-color="activeTextColor"
    mode="vertical"
  >
    <el-menu-item index="/">数据表</el-menu-item>
    <el-menu-item index="/user">用户</el-menu-item>
    <el-menu-item index="/client">终端</el-menu-item>
    <el-menu-item index="/camera">摄像头</el-menu-item>
    <el-menu-item index="/operate">事件操作</el-menu-item>
    <el-menu-item index="/other">其他</el-menu-item>
    <el-menu-item index="/test">测试数据</el-menu-item>
    <el-menu-item index="/test2">测试数据2</el-menu-item>
    <el-menu-item index="/waterfall">瀑布流</el-menu-item>
    <el-menu-item index="/color">颜色</el-menu-item>
    <el-menu-item index="/calendar">日历</el-menu-item>
    <el-menu-item index="/chart">图表</el-menu-item>
  </el-menu>
</template>

<script>
//  import {} from ''
export default {
  name: 'MenuModule',
  data() {
    return {
      isCollapse: false,
      activeMenu: '',
      backgroundColor: '',
      textColor: '',
      activeTextColor: '',
    }
  },

  mounted() {},

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>
