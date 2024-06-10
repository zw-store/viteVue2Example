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
    <el-menu-item index="/">page 1</el-menu-item>
    <el-menu-item index="/test">page 2</el-menu-item>
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
