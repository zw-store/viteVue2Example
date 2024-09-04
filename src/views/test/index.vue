<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-02
 -->

<template>
  <div>
    <div class="flex justify-center items-center" style="height: 100vh">
      <ScrollPanel ref="container" class="w-96 h-96">
        <el-table :affix-target="container" :data="Array.from({ length: 20 }, () => ({ date: '2023-12-12', name: '小明' }))" stripe :header-cell-style="{ backgroundColor: '#efefef' }" :disabled-affix="false">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        </el-table>
      </ScrollPanel>
    </div>

    <div class="affix-container2 !bg-yellow-600" style="height: 150vh"></div>
    <div class="affix-container2 !bg-gray-600" style="height: 150vh"></div>
  </div>
</template>

<script>
//  import {} from ''
export default {
  name: 'index',
  data() {
    return {
      container: null,
    }
  },

  mounted() {
    this.container = this.$refs.container.$el
  },

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>
