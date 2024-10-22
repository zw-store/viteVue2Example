<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-01
 -->

<template>
  <el-row :gutter="10">
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
import jsondata from './data.json'

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
      const actions = new Set()
      const colorBy = {}

      const generateData = () => {
        const sortable = jsondata.sort((a, b) => a.time - b.time)
        minAxis = sortable[0].stamp
        maxAxis = sortable[sortable.length - 1].stamp

        const data = groupBy(jsondata, 'name')
        return Object.entries(data).reduce((acc, cur, index) => {
          const [key, values] = cur
          let _startTime = minAxis
          const items = values
            .sort((a, b) => a.stamp - b.stamp)
            .map((item, ii, arr) => {
              const nextItem = arr[ii + 1]
              const duration = nextItem ? nextItem.stamp - item.stamp : 0
              const value = [index, _startTime, (_startTime += duration), duration]
              _startTime += duration
              const color = colorBy[item.opera] || (colorBy[item.opera] = Random.color())
              actions.has(item.opera) || actions.add(item.opera)
              return { name: item.opera, value, itemStyle: { color } }
            })
          acc[key] = items
          return acc
        }, {})
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

      const findBy = (obj, key) => {
        return Object.values(obj).reduce((acc, cur) => {
          const item = cur.filter(item => item.name === key)
          if (item.length) {
            acc = acc.concat(item)
          }
          return acc
        }, [])
      }

      myChart.setOption({
        baseOption: {
          timeline: {
            width: '50%',
            left: '50%',
            axisType: 'category',
            autoPlay: false,
            playInterval: 1000,
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
            const category = Object.keys(groupByDataName)
            return {
              legend: [{ data: Array.from(actions) }],
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
                { data: category, axisLine: { show: true }, axisTick: { show: true }, splitLine: { show: true } },
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
              series: Array.from(actions, item => {
                return {
                  type: 'custom',
                  name: item,
                  renderItem,
                  itemStyle: { opacity: 0.8 },
                  encode: { x: [1, 2], y: 0 },
                  data: findBy(groupByDataName, item),
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
