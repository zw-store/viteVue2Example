<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-28
 -->

<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card style="height: 500px" :body-style="{ height: '100%', color: '#fff' }">
        <div ref="chart" style="height: calc(100% - 10px)"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from 'echarts'
import { Random } from 'mockjs'
import 'animate.css'
import tinycolor from 'tinycolor2'

export default {
  name: 'index',
  data() {
    return {
      chart: null,
      options0: ['播放视频', '下载视频', '回放视频', '控制设备', '登录', '退出', '其他操作', '订阅', '通知', '查询', '播放失败', '停止'],
      form: {},
    }
  },

  mounted() {
    this.initChart()
  },

  methods: {
    initChart() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }

      const chart = (this.chart = echarts.init(this.$refs.chart))

      const ccolor = Array.from(['#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#e879f9', '#34d399', '#fb7185', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8'], item => {
        const c = tinycolor(item)
        const c1 = c.clone().desaturate(65).toHexString()
        const c2 = c.darken(20).desaturate(40).toHexString()
        return [c1, c2]
      })

      chart.setOption({
        title: {
          text: '操作行为环比统计(周)',
          subtext: '各类别行为环比增长',
          left: 'left',
          textStyle: {
            color: '#000',
          },
        },
        brush: {
          show: false,
          brushType: 'rect',
          brushLink: 'all',
          brushMode: 'multiple',
          transformable: true,
          toolbox: [],
          xAxisIndex: 0,
          inBrush: {
            opacity: 1,
          },
          outOfBrush: {
            opacity: 0,
          },
          brushStyle: {
            borderWidth: 1,
            color: 'rgba(100, 116, 139, 0.3)',
            borderColor: 'rgba(238, 240, 215, 0.8)',
          },
        },
        grid: { top: '18%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        legend: [{ data: ['上周', '本周'], left: 'right', orient: 'vertical' }],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: params => {
            const data = params.map(x => ({
              name: x.name,
              value: x.value,
              color: x.color,
            }))

            const ratio = (((data[1].value - data[0].value) / data[0].value) * 100).toFixed(2) + '%'

            return `
              <div style="display: flex; align-items: center;">
                <div>${params[0].name}</div>
              </div>
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${data[1].color}; margin-right: 5px;"></div>
                <div>${data[1].name}: ${data[1].value}</div>
              </div>
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${data[0].color}; margin-right: 5px;"></div>
                <div>${data[0].name}: ${data[0].value}</div>
              </div>
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${data[0].color}; margin-right: 5px;"></div>
                <div>环比${parseInt(ratio) < 0 ? '下降' : '增长'}: ${ratio}</div>
              </div>
            `
          },
        },
        xAxis: {
          type: 'category',
          data: this.options0,
        },
        yAxis: {},
        barWidth: '20%',
        barMaxWidth: 30,
        series: ['上周', '本周'].map((name, i) => {
          return {
            name,
            type: 'bar',
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
            },
            data: Array.from({ length: this.options0.length }, (_, j) => {
              return {
                value: Random.integer(0, 100),
                name: this.options0[j],
                itemStyle: {
                  color: ccolor[j][i],
                },
              }
            }),
          }
        }),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 1rem;
  border: 1px solid #186886;
  border-radius: 5px;
  background: #092d55;
}
</style>

<style>
.circle {
  position: fixed;
  z-index: 9999;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  left: var(--left);
  top: var(--top);
}

.circle-icon {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: #fff;
  text-align: center;
}

@keyframes moveY {
  to {
    transform: translateY(var(--y));
  }
}

.circle {
  --duration: 0.35s;
  animation: moveY var(--duration) cubic-bezier(0.5, -0.5, 1, 1);
}

@keyframes moveX {
  to {
    transform: translateX(var(--x));
  }
}

.circle-icon {
  /* 最后一帧 */
  animation: moveX var(--duration) ease-in-out;
  animation-fill-mode: forwards;
}
</style>
