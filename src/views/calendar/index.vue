<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-27
 -->

<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <Calendar v-model="month9" :data="month9Data" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col :span="6">
      <Calendar v-model="month8" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col :span="6">
      <Calendar v-model="month7" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col :span="6">
      <Calendar v-model="month6" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col class="mt-2.5" :span="6">
      <Calendar v-model="month5" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col class="mt-2.5" :span="6">
      <Calendar v-model="month4" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col class="mt-2.5" :span="6">
      <Calendar v-model="month3" :controlBtns="false"> </Calendar>
    </el-col>

    <el-col class="mt-2.5" :span="6">
      <Calendar v-model="month2" :controlBtns="false"> </Calendar>
    </el-col>
  </el-row>
</template>

<script>
import Calendar from '@/components/Calendar'
import { Random } from 'mockjs'

export default {
  name: 'index',
  components: { Calendar },
  data() {
    return {
      month9: new Date('2024-09-01'),
      month9Data: Array.from({ length: 12 }, () => {
        return {
          date: Random.date('09-dd'),
          value: Random.integer(1, 100),
        }
      }).sort((a, b) => b.date - a.date),
      month8: new Date('2024-08-01'),
      month7: new Date('2024-07-01'),
      month6: new Date('2024-06-01'),
      month5: new Date('2024-05-01'),
      month4: new Date('2024-04-01'),
      month3: new Date('2024-03-01'),
      month2: new Date('2024-02-01'),
      month1: new Date('2024-01-01'),
    }
  },

  mounted() {},

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>
