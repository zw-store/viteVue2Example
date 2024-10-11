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
import { color } from 'zrender'
import 'echarts-wordcloud'

export default {
  name: 'index',
  data() {
    return {
      integer: () => Random.integer(200, 300),
      rcolor: () => Random.color(),
      diskData: Array.from({ length: Random.integer(5, 5) }, () => {
        const type = action[Random.integer(0, action.length - 1)]
        const parentvalue = Random.integer(100, 300)

        const children = Array.from({ length: Random.integer(3, 6) }, () => {
          const usernamne = Random.cname()
          return {
            name: usernamne,
            value: Random.integer(0, parentvalue),
            path: type + '/' + usernamne,
            itemStyle: {
              color: '#94a3b8',
              // color: Random.color(),
            },
            label: {
              color: '#000',
            },
          }
        })

        return {
          name: type,
          value: parentvalue,
          path: type,
          itemStyle: {
            color: '#94a3b8',
          },
          children,
        }
      }),
    }
  },

  mounted() {
    this.initCharts()
  },

  methods: {
    initCharts() {
      const myChart = echarts.init(this.$refs.chart)
      function getLevelOption() {
        return [
          {
            itemStyle: {
              // borderColor: '#777',
              borderWidth: 4,
              gapWidth: 15,
            },
            upperLabel: {
              show: false,
            },
          },
          {
            itemStyle: {
              borderColor: '#cbd5e1',
              borderWidth: 5,
              gapWidth: 1,
            },

            emphasis: {
              itemStyle: {
                borderColor: '#ddd',
              },
            },
          },
          {
            colorSaturation: [0.1, 0.1],
            itemStyle: {
              borderWidth: 5,
              gapWidth: 1,
              borderColorSaturation: 0.6,
            },
          },
        ]
      }

      myChart.setOption({
        backgroundColor: '#d4d4d4',
        title: {
          text: '用户动作高频率操作面积占比图（Top5）',
          left: 'center',
        },
        tooltip: {
          formatter(info) {
            var value = info.value
            var treePathInfo = info.treePathInfo
            var treePath = []
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }
            return ['<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>', '操作次数: ' + echarts.format.addCommas(value) + ''].join('')
          },
        },
        series: [
          {
            name: '用户操作',
            type: 'treemap',
            visibleMin: 80,
            label: {
              show: true,
              formatter: '{b}: {c}%',
            },
            upperLabel: {
              show: true,
              height: 30,
            },
            itemStyle: {
              borderColor: '#fff',
            },
            levels: getLevelOption(),
            data: this.diskData,
          },
        ],
      })
    },
  },
  //  End
}
</script>

<style lang="css" scoped></style>
