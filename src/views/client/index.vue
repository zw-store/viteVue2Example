<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-27
 -->

<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-col>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>新增终端环比上月{{ ratioPerMonth(currMonth.newUser, prevMonth.newUser) >= 0 ? '增长' : '减少' }} ：{{ Math.abs(ratioPerMonth(currMonth.newUser, prevMonth.newUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.newUser, currMonth.newUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.newUser, currMonth.newUser).toFixed(2) }} </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="Math.abs(ratioPerUser(currMonth.newUser, prevMonth.newUser))" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.newUser, prevMonth.newUser).toFixed(2) }} </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </el-col>

      <el-col>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>活跃终端环比上月{{ ratioPerMonth(currMonth.activeUser, prevMonth.activeUser) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.activeUser, prevMonth.activeUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.activeUser, currMonth.activeUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.activeUser, currMonth.activeUser).toFixed(2) }}% </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerUser(currMonth.activeUser, prevMonth.activeUser)" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.activeUser, prevMonth.activeUser).toFixed(2) }}% </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </el-col>

      <el-col>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>僵尸终端环比上月{{ ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.zombieUser, currMonth.zombieUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.zombieUser, currMonth.zombieUser).toFixed(2) }} </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerUser(currMonth.zombieUser, prevMonth.zombieUser)" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.zombieUser, prevMonth.zombieUser).toFixed(2) }} </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </el-col>
    </el-col>

    <el-col :span="8">
      <el-card>
        <template #header>
          活跃终端多用户数据
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-table size="mini" :data="table.data" stripe :header-cell-style="{ backgroundColor: '#efefef' }">
          <el-table-column align="center" prop="name" label="终端名称" />
          <el-table-column align="center" prop="ratio" label="较比上月" :formatter="(_, __, val) => `${parseInt(val) >= 0 ? '增加' : '减少'}${Math.abs(val)}%`" />
        </el-table>
      </el-card>
    </el-col>

    <el-col :span="8">
      <el-card>
        <template #header>
          所属单位操作终端数
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-table size="mini" :data="terminalOwner" stripe :header-cell-style="{ backgroundColor: '#efefef' }">
          <el-table-column align="center" prop="organiza" label="所属单位名称" />
          <el-table-column align="center" prop="count" label="操作次数" />
          <el-table-column align="center" prop="ratio" label="较比上月" :formatter="(_, __, val) => `${parseInt(val) >= 0 ? '增加' : '减少'}${Math.abs(val)}%`" />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { Random } from 'mockjs'
console.log(Random)
import * as echarts from 'echarts'

const city = ['辛集市', '定州市', '衡水市', '廊坊市', '沧州市', '承德市', '张家口市', '保定市', '邢台市', '邯郸市', '秦皇岛市', '唐山市', '石家庄市']
export default {
  name: 'index',
  data() {
    return {
      radio1: '本月',
      prevMonth: {
        newUser: 563,
        activeUser: 320,
        zombieUser: 39,
      },
      currMonth: {
        newUser: 592,
        activeUser: 120,
        zombieUser: 67,
      },
      table: {
        data: [
          { name: '192.168.0.1', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
          { name: '192.168.0.2', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
          { name: '192.168.0.3', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
          { name: '192.168.0.4', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
          { name: '192.168.0.5', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
        ],
      },
      terminalOwner: [
        { organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
        { organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
        { organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
        { organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
        { organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) },
      ],
    }
  },

  mounted() {
    // this.initChart()
  },

  methods: {
    ratioPerUser: (a, b) => (a / (a + b)) * 100,
    ratioPerMonth: (a, b) => (((a - b) / b) * 100).toFixed(2),
    initChart() {
      const chart = echarts.init(this.$refs.chart)

      chart.setOption()
    },
  },
  //  End

  /**
    *
    *  终端192.178.9.2 来自示例单位的民警老张，此终端操作过n个终端，标记为活跃终端
    *  新增终端数 较増 1%
    *  活跃终端指数 较増 1%
    *  僵尸终端指数 较增 0.1%

    *  终端192.168.0.222 用户使用新增12，较比增长1%
    */
}
</script>

<style lang="css" scoped></style>
