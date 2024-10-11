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
const action = ['播放视频', '下载视频', '回放视频', '控制设备', '登录', '退出', '其他操作', '订阅', '通知', '查询', '播放失败', '停止']
import 'echarts-wordcloud'

export default {
  name: 'index',
  data() {
    return {
      integer: () => Random.integer(200, 300),
      rcolor: () => Random.color(),
    }
  },

  mounted() {
    this.initCharts()
  },

  methods: {
    initCharts() {
      const myChart = echarts.init(this.$refs.chart)

      myChart.setOption({
        backgroundColor: '#fefefe',
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',
            keepAspect: false,
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            shrinkToFit: false,
            layoutAnimation: true,
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')'
              },
            },
            emphasis: {
              focus: 'self',
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: '#333',
              },
            },

            data: Array.from({ length: action.length }, () => {
              return {
                name: action[Random.integer(0, action.length - 1)],
                value: this.integer(),
                textStyle: {
                  color: Random.color(),
                },
              }
            }),
          },
        ],
      })
    },
  },
  //  End
}
</script>

<style lang="css" scoped></style>
