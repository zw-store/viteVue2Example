<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-06-08
 -->

<template>
  <Waterfall>
    <WaterfallItem width="30%">
      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>新发现用户环比上月{{ ratioPerMonth(currMonth.newUser, prevMonth.newUser) >= 0 ? '增长' : '减少' }} ：{{ Math.abs(ratioPerMonth(currMonth.newUser, prevMonth.newUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.newUser, currMonth.newUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.newUser, currMonth.newUser).toFixed(2) }} </template>

              <template #tooltip
                ><p>新用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月用户：{{ prevMonth.newUser }}</p>
                <p>当月用户：{{ currMonth.newUser }}</p>
                <p>当月比上月{{ currMonth.newUser - prevMonth.newUser >= 0 ? '增加' : '减少' }} ：{{ Math.abs(currMonth.newUser - prevMonth.newUser) }}个</p>
              </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="Math.abs(ratioPerUser(currMonth.newUser, prevMonth.newUser))" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.newUser, prevMonth.newUser).toFixed(2) }} </template>

              <template #tooltip>
                <p>新用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月用户：{{ prevMonth.newUser }}</p>
                <p>当月用户：{{ prevMonth.newUser }}</p>
                <p>环比上月数据{{ ratioPerMonth(currMonth.newUser, prevMonth.newUser) >= 0 ? '高' : '低' }} ：{{ Math.abs(ratioPerMonth(currMonth.newUser, prevMonth.newUser)) }}%</p>
              </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>

      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>活跃用户环比上月{{ ratioPerMonth(currMonth.activeUser, prevMonth.activeUser) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.activeUser, prevMonth.activeUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.activeUser, currMonth.activeUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.activeUser, currMonth.activeUser).toFixed(2) }}% </template>

              <template #tooltip>
                <p>活跃用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月活跃用户：{{ prevMonth.activeUser }}</p>
                <p>当月活跃用户：{{ currMonth.activeUser }}</p>
                <p>当月比上月{{ currMonth.activeUser - prevMonth.activeUser >= 0 ? '增加' : '减少' }} ：{{ Math.abs(currMonth.activeUser - prevMonth.activeUser) }}个</p>
              </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerUser(currMonth.activeUser, prevMonth.activeUser)" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.activeUser, prevMonth.activeUser).toFixed(2) }}% </template>

              <template #tooltip>
                <p>活跃用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月活跃用户：{{ prevMonth.activeUser }}</p>
                <p>当月活跃用户：{{ currMonth.activeUser }}</p>
                <p>环比上月数据{{ ratioPerMonth(currMonth.activeUser, prevMonth.activeUser) >= 0 ? '增长' : '减少' }}：{{ Math.abs(ratioPerMonth(currMonth.activeUser, prevMonth.activeUser)) }}%</p>
              </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>

      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>僵尸用户环比上月{{ ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerUser(prevMonth.zombieUser, currMonth.zombieUser)">
              <template> 上月：{{ ratioPerUser(prevMonth.zombieUser, currMonth.zombieUser).toFixed(2) }} </template>

              <template #tooltip>
                <p>僵尸用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月僵尸用户：{{ prevMonth.zombieUser }}</p>
                <p>当月僵尸用户：{{ currMonth.zombieUser }}</p>
                <p>当月比上月{{ currMonth.zombieUser - prevMonth.zombieUser >= 0 ? '增加' : '减少' }} ：{{ Math.abs(currMonth.zombieUser - prevMonth.zombieUser) }}个</p>
              </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerUser(currMonth.zombieUser, prevMonth.zombieUser)" placement="top">
              <template> 当月：{{ ratioPerUser(currMonth.zombieUser, prevMonth.zombieUser).toFixed(2) }} </template>

              <template #tooltip>
                <p>僵尸用户</p>
                <hr class="mt-1 mb-2" />
                <p>上月僵尸用户：{{ prevMonth.zombieUser }}</p>
                <p>当月僵尸用户：{{ currMonth.zombieUser }}</p>
                <p>环比上月数据{{ ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser) >= 0 ? '增长' : '减少' }}：{{ Math.abs(ratioPerMonth(currMonth.zombieUser, prevMonth.zombieUser)) }}%</p>
              </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>
    </WaterfallItem>

    <WaterfallItem width="30%">
      <div ref="chart" style="height: 300px"></div>
    </WaterfallItem>

    <WaterfallItem width="30%" height="180">
      <ScrollPanel style="height: 100%; padding: 4px 6px">
        <el-table size="mini" :data="prevMonth.operByUser" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="name" label="name" />
          <el-table-column align="center" prop="count" label="count" />
        </el-table>
      </ScrollPanel>
    </WaterfallItem>

    <WaterfallItem width="50%">
      <div ref="chart1" style="height: 300px"></div>
    </WaterfallItem>

    <WaterfallItem width="30%">
      <ScrollPanel style="height: 350px">
        <el-table size="mini" :data="Array.from(prevMonth.operByUser).reverse()" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="name" label="name" />
          <el-table-column align="center" prop="count" label="count" />
        </el-table>
      </ScrollPanel>
    </WaterfallItem>
  </Waterfall>
</template>

<script>
import * as echarts from 'echarts'
import Waterfall from '@/components/Waterfall'
import WaterfallItem from '@/components/waterfall/WaterfallItem'

export default {
  name: 'dashboard',
  components: { Waterfall, WaterfallItem },

  data() {
    return {
      chart: null,
      chart1: null,
      prevMonth: {
        newUser: 563,
        activeUser: 320,
        zombieUser: 39,
        operByUser: [
          { name: '张三', count: 194 },
          { name: '李四', count: 98 },
          { name: '王五', count: 78 },
          { name: '赵六', count: 67 },
          { name: '孙七', count: 56 },
          { name: '周八', count: 45 },
          { name: '吴九', count: 34 },
          { name: '郑十', count: 23 },
          { name: '钱十一', count: 12 },
          { name: '孔十二', count: 1 },
        ],
      },
      currMonth: {
        newUser: 592,
        activeUser: 120,
        zombieUser: 67,
      },
    }
  },

  mounted() {
    this.initChart()
    this.initChart1()
  },

  methods: {
    ratioPerUser: (a, b) => (a / (a + b)) * 100,
    ratioPerMonth: (a, b) => (((a - b) / b) * 100).toFixed(2),
    initChart() {
      const chart = echarts.init(this.$refs.chart)

      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      this.chart = chart
      chart.setOption({
        title: { text: '用户登录方式', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left', data: ['本月', '上月'] },
        radius: ['40%', '70%'],
        center: ['50%', '70%'],
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
        series: [
          {
            name: '上月',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            clockwise: false,
            data: [
              { value: 335, name: '密码登录', itemStyle: { color: '#37A2DA' } },
              { value: 310, name: 'KPI', itemStyle: { color: '#32C5E9' } },
              {
                value: 335 + 310,
                itemStyle: { color: 'none', decal: { symbol: 'none' } },
              },
            ],
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
          },
          {
            name: '本月',
            type: 'pie',
            radius: '55%',
            center: ['51%', '60%'],
            clockwise: true,
            data: [
              { value: 14, name: '密码登录', itemStyle: { color: '#E062AE' } },
              { value: 98, name: 'KPI', itemStyle: { color: '#8378EA' } },
              {
                value: 14 + 98,
                itemStyle: { color: 'none', decal: { symbol: 'none' } },
              },
            ],
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
          },
        ],
      })
    },
    initChart1() {
      const chart = echarts.init(this.$refs.chart1)

      if (this.chart1) {
        this.chart1.dispose()
        this.chart1 = null
      }
      this.chart1 = chart
      chart.setOption({
        title: {
          text: '操作次数最多的用户',
          subtext: '上月前十数据',
          left: 'right',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: '60',
          data: this.prevMonth.operByUser.map(item => ({ name: item.name, value: item.count, icon: 'circle' })),
          itemStyle: {},
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            width: '70%',
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
            label: {
              position: 'outer',
              alignTo: 'edge',
              edgeDistance: 20,
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center',
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33,
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },

            data: this.prevMonth.operByUser.map(item => ({ value: item.count, name: item.name })),
          },
        ],
      })
    },
  },

  //  End
}

/**
 * 小王使用密码登录方式登录了大华平台，操作过n个终端，标记为活跃用户
 *
 * 新增用户量 较增 1%
 * 活跃用户指数 较增 1%
 * 僵尸用户指数 较增 0.1%
 *
 * 用户小罗 操作终端数新增12，较比增长1%
 *
 *        ┌─  密码登录
 * 登录方式┆
 *        └─  KPI
 *
 * 上月操作最多的前十用户 【张三】【李四】【王五】【赵六】【孙七】【周八】【吴九】【郑十】【钱十一】【孔十二】
 * 本月操作最多的前十用户 【小王】【小李】【小张】【小赵】【小孙】【小周】【小吴】【小郑】【小钱】【小孔】
 *
 */
</script>

<style lang="css" scoped></style>
