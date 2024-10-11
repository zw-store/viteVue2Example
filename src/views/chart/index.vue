<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-01
 -->

<template>
  <el-row :gutter="10">
    <el-col>
      <el-form :model="form" inline size="mini" label-width="100px">
        <el-form-item label="时间范围">
          <el-date-picker v-model="form.date" type="datetimerange" placeholder="选择日期时间" />
        </el-form-item>

        <el-form-item label="操作类型">
          <el-select v-model="form.action" placeholder="请输入名称" multiple>
            <el-option v-for="item in actions" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="22">
      <el-card style="height: 700px" :body-style="{ height: '100%', background: '#fefefe', color: '#fff', border: '1px solid #186886' }">
        <div ref="chart" style="height: calc(100% - 10px)"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from 'echarts'
import { Random } from 'mockjs'
import dayjs from 'dayjs'

const actions = [
  { name: '登录', color: Random.color() },
  { name: '退出', color: Random.color() },
  { name: '订阅', color: Random.color() },
  { name: '播放失败', color: Random.color() },
  { name: '回放视频', color: Random.color() },
  { name: '控制设备', color: Random.color() },
]

const categories = () => ['admin', 'zlxtest3', '钟德成190（海康公司）', 'zlx_test', '钟德成（海康公司）', 'test2', 'spxj', 'gqj', 'junfenqu', 'swzbs'].sort(() => Math.random() - 0.5)

const groupBy = (data, key) => {
  return data.reduce((acc, cur) => {
    acc[cur[key]] = acc[cur[key]] || []
    acc[cur[key]].push(cur)
    return acc
  }, {})
}

export default {
  name: 'index',
  data() {
    return {
      integer: () => Random.integer(200, 300),
      rcolor: () => Random.color(),
      actions,
      form: {
        date: [dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
        name: '',
        action: [],
      },
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    }
  },

  mounted() {
    this.initCharts()
  },

  methods: {
    initCharts() {
      const myChart = echarts.init(this.$refs.chart)
      let minAxis = 0
      let maxAxis = 0

      const generateData = () => {
        const data = []
        categories().forEach((_, index) => {
          const types = Array.from({ length: 10 }, () => ({ ...Random.pick(actions), time: +new Date(Random.time(`2024-09-0${Random.integer(1, 9)} HH:mm:ss`)) })).sort((a, b) => a.time - b.time)

          maxAxis = types[types.length - 1].time
          let baseTime = (minAxis = types[0].time)

          types.forEach((item, ii, arr) => {
            const nextItem = arr[ii + 1]
            const duration = nextItem ? nextItem.time - item.time : 0
            const value = [index, baseTime, (baseTime += duration), duration]
            baseTime += duration

            data.push({ name: item.name, value, itemStyle: { color: item.color } })
          })
        })

        return groupBy(data, 'name')
      }

      function renderItem(params, api) {
        const categoryIndex = api.value(0)

        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6
        const rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height,
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          },
        )

        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style(),
          }
        )
      }

      myChart.setOption({
        baseOption: {
          title: {
            text: '用户行为统计',
            left: 'left',
          },
          brush: {
            show: false,
            brushType: 'rect',
            brushLink: 'all',
            brushMode: 'multiple',
            transformable: true,
            toolbox: [],
            xAxisIndex: 0,
            brushStyle: {
              borderWidth: 1,
              color: 'rgba(100, 116, 139, 0.3)',
              borderColor: 'rgba(238, 240, 215, 0.8)',
            },
          },
          timeline: {
            width: '50%',
            left: '50%',
            axisType: 'category',
            autoPlay: false,
            playInterval: 5000,
            data: Array.from({ length: 10 }, (_, i) => ({ value: i + 1, tooltip: { formatter: `第${i + 1}页` } })),
          },
          backgroundColor: '#fefefe',
          grid: { top: '18%', left: '3%', right: '4%', bottom: '18%', containLabel: true },
          dataZoom: [
            {
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              bottom: '3%',
              labelFormatter: '',
              left: 0,
              width: '45%',
            },
            {
              type: 'inside',
              filterMode: 'weakFilter',
            },
          ],
        },
        options: [
          ...Array.from({ length: 10 }, () => {
            const groupByDataName = generateData()
            const category = categories()
            return {
              legend: [{ data: Object.keys(groupByDataName) }],
              xAxis: [
                {
                  min: minAxis,
                  max: maxAxis,
                  scale: true,
                  axisLine: { show: true },
                  axisTick: { show: true },
                  splitLine: { show: true },
                  axisLabel: {
                    formatter(val) {
                      const [date, time] = dayjs(val).format('YYYY-MM-DD HH:mm').split(' ')
                      return `${time}\n${date}`
                    },
                  },
                },
                {
                  min: minAxis,
                  max: maxAxis,
                  scale: true,
                  axisLine: { show: true },
                  axisTick: { show: true },
                  splitLine: { show: true },
                  axisLabel: {
                    formatter(val) {
                      const [date, time] = dayjs(val).format('YYYY-MM-DD HH:mm').split(' ')
                      return `${date}\n${time}`
                    },
                  },
                },
              ],
              yAxis: [
                { data: category, axisLine: { show: true }, axisTick: { show: true }, splitLine: { show: true } },
                // { data: category, axisLine: { show: true }, axisTick: { show: true }, splitLine: { show: true } },
              ],
              tooltip: {
                trigger: 'item',
                axisPointer: {
                  type: 'cross',
                  label: {
                    formatter(params) {
                      return params.axisDimension === 'y' ? `${params.value}` : `${dayjs(params.value).format('YYYY-MM-DD HH:mm:ss')}`
                    },
                  },
                  crossStyle: { color: '#999', width: 2 },
                },
                formatter(params) {
                  return `${params.marker}
                          ${params.name}<br/>
                          ${params.marker}起始时间：${dayjs(params.value[1]).format('YYYY-MM-DD HH:mm:ss')} <br/>
                          ${params.marker}结束时间：${dayjs(params.value[2]).format('YYYY-MM-DD HH:mm:ss')}
                          `
                },
              },
              series: Object.entries(groupByDataName).map(([key, value]) => {
                return {
                  type: 'custom',
                  name: key,
                  renderItem,
                  itemStyle: { opacity: 0.8 },
                  encode: { x: [1, 2], y: 0 },
                  data: value,
                }
              }),
            }
          }),
        ],
      })
    },
  },
}
</script>

<style lang="css" scoped></style>
