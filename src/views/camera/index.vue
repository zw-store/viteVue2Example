<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-27
 -->

<template>
  <Waterfall ref="waterfall" :gutter="20">
    <WaterfallItem width="30%">
      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <el-button type="success" size="mini" @click="$refs.waterfall.layout()">xxx</el-button>
            <p>新增摄像头环比上月{{ ratioPerMonth(currMonth.newCamera, prevMonth.newCamera) >= 0 ? '增长' : '减少' }} ：{{ Math.abs(ratioPerMonth(currMonth.newCamera, prevMonth.newCamera)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(prevMonth.newCamera, currMonth.newCamera)">
              <template> 上月：{{ ratioPerCamera(prevMonth.newCamera, currMonth.newCamera).toFixed(2) }} </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="Math.abs(ratioPerCamera(currMonth.newCamera, prevMonth.newCamera))" placement="top">
              <template> 当月：{{ ratioPerCamera(currMonth.newCamera, prevMonth.newCamera).toFixed(2) }} </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>

      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>活跃摄像头环比上月{{ ratioPerMonth(currMonth.activeCamera, prevMonth.activeCamera) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.activeCamera, prevMonth.activeCamera)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(prevMonth.activeCamera, currMonth.activeCamera)">
              <template> 上月：{{ ratioPerCamera(prevMonth.activeCamera, currMonth.activeCamera).toFixed(2) }}% </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(currMonth.activeCamera, prevMonth.activeCamera)" placement="top">
              <template> 当月：{{ ratioPerCamera(currMonth.activeCamera, prevMonth.activeCamera).toFixed(2) }}% </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>

      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>僵尸摄像头环比上月{{ ratioPerMonth(currMonth.zombieCamera, prevMonth.zombieCamera) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.zombieCamera, prevMonth.zombieCamera)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(prevMonth.zombieCamera, currMonth.zombieCamera)">
              <template> 上月：{{ ratioPerCamera(prevMonth.zombieCamera, currMonth.zombieCamera).toFixed(2) }} </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(currMonth.zombieCamera, prevMonth.zombieCamera)" placement="top">
              <template> 当月：{{ ratioPerCamera(currMonth.zombieCamera, prevMonth.zombieCamera).toFixed(2) }} </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>

      <div>
        <el-card style="height: 148px" :body-style="{ padding: 0, height: '100%' }">
          <template #header>
            <p>重点摄像头环比上月{{ ratioPerMonth(currMonth.importantCamera, prevMonth.importantCamera) >= 0 ? '增长' : '减少' }} ： {{ Math.abs(ratioPerMonth(currMonth.importantCamera, prevMonth.importantCamera)) }}%</p>
          </template>

          <el-volume>
            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(prevMonth.importantCamera, currMonth.importantCamera)">
              <template> 上月：{{ ratioPerCamera(prevMonth.importantCamera, currMonth.importantCamera).toFixed(2) }} </template>
            </el-volume-item>

            <el-volume-item style="height: 24px" :percentage="ratioPerCamera(currMonth.importantCamera, prevMonth.importantCamera)" placement="top">
              <template> 当月：{{ ratioPerCamera(currMonth.importantCamera, prevMonth.importantCamera).toFixed(2) }} </template>
            </el-volume-item>
          </el-volume>
        </el-card>
      </div>
    </WaterfallItem>

    <WaterfallItem width="30%">
      <el-card>
        <template #header>
          地区摄像头新增数据
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-alert type="warning" :closable="false" size="mini" class="!py-0">地区摄像头新增率高，表示得到重视。</el-alert>
        <el-table size="mini" :data="terminalOwner1" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="organiza" label="地区" show-overflow-tooltip />
          <el-table-column align="center" prop="count" label="新增数量" />
          <el-table-column align="center" prop="ratio" label="较比上月" :formatter="(_, __, val) => `${parseInt(val) >= 0 ? '增加' : '减少'}${Math.abs(val)}%`" />
        </el-table>
      </el-card>
    </WaterfallItem>

    <WaterfallItem width="30%">
      <el-card>
        <template #header>
          所属单位摄像头新增数据
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-alert type="warning" :closable="false" size="mini" class="!py-0">单位摄像头新增率高，表示该单位应该有相关事务。</el-alert>

        <el-table size="mini" :data="terminalOwner" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="organiza" label="所属单位" show-overflow-tooltip />
          <el-table-column align="center" prop="count" label="新增数量" />
          <el-table-column align="center" prop="ratio" label="较比上月" />
        </el-table>
      </el-card>
    </WaterfallItem>

    <WaterfallItem width="35%">
      <el-card>
        <template #header>
          重点摄像头 Top5 数据
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-alert type="warning" :closable="false" size="mini" class="!py-0">单位重点摄像头比率值改变，表示该单位相关事务有所动作有所变化。</el-alert>

        <el-table size="mini" :data="terminalOwner" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="organiza" label="所属单位" show-overflow-tooltip />
          <el-table-column align="center" prop="count" label="重点摄像头数量" />
          <el-table-column align="center" prop="ratio" label="较比上月" />
        </el-table>
      </el-card>
    </WaterfallItem>

    <WaterfallItem width="35%" height="400px">
      <div ref="chart" style="width: 100%; height: 100%; background-color: #fff"></div>
    </WaterfallItem>

    <WaterfallItem width="320px">
      <el-card>
        <template #header>
          地区摄像头新增数据
          <el-radio-group class="float-right scale-90" size="mini" v-model="radio1">
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="上月"></el-radio-button>
          </el-radio-group>
        </template>

        <el-alert type="warning" :closable="false" size="mini" class="!py-0">地区摄像头新增率高，表示得到重视。</el-alert>
        <ScrollPanel class="h-full">
          <el-table size="mini" :data="terminalOwner1" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
            <el-table-column align="center" prop="organiza" label="地区" show-overflow-tooltip />
            <el-table-column align="center" prop="count" label="新增数量" />
            <el-table-column align="center" prop="ratio" label="较比上月" :formatter="(_, __, val) => `${parseInt(val) >= 0 ? '增加' : '减少'}${Math.abs(val)}%`" />
          </el-table>
        </ScrollPanel>
      </el-card>
    </WaterfallItem>

    <WaterfallItem width="35%" height="400px">
      <div ref="chart2" style="width: 100%; height: 100%; background-color: #fff"></div>
    </WaterfallItem>

    <WaterfallItem width="35%" height="400px">
      <el-card>
        <template #header> 频繁被访问重点摄像头 </template>

        <el-alert type="warning" :closable="false" size="mini" class="!py-0">被持续关注的重点摄像头</el-alert>

        <el-table size="mini" :data="cameraVisited" stripe :header-cell-style="{ backgroundColor: '#efefef' }" disabled-affix>
          <el-table-column align="center" prop="cameraId" label="摄像头编号" show-overflow-tooltip />
          <el-table-column align="center" prop="count" label="操作次数" />
          <el-table-column align="center" prop="ratio" label="较比上月" :formatter="(_, __, val) => `${parseInt(val) >= 0 ? '增加' : '减少'}${Math.abs(val)}%`" />
        </el-table>
      </el-card>
    </WaterfallItem>
  </Waterfall>
</template>

<script>
import { Random } from 'mockjs'
import * as echarts from 'echarts'
import Waterfall from '@/components/Waterfall'
import WaterfallItem from '@/components/waterfall/WaterfallItem'

const city = ['辛集市', '定州市', '衡水市', '廊坊市', '沧州市', '承德市', '张家口市', '保定市', '邢台市', '邯郸市', '秦皇岛市', '唐山市', '石家庄市']
const posit = ['医院', '市政厅门口', '学校', '公园', '商场', '小区', '银行', '车站', '机场', '码头', '火车站', '地铁站', '公交', '高速', '收费站']
const status = ['正常', '异常', '维修', '报废', '未知']
const type = ['枪机', '半球', '球机', '云台', '红外', '全景', '人脸', '车牌', '高清', '标清', '智能', '高速', '全景', '人脸', '车牌', '高清', '标清', '智能', '高速']
export default {
  name: 'index',
  components: { Waterfall, WaterfallItem },
  data() {
    return {
      integer: () => Random.integer(200, 300),
      rcolor: () => Random.color(),
      radio1: '本月',
      prevMonth: {
        newCamera: 563,
        activeCamera: 320,
        zombieCamera: 39,
        importantCamera: 120,
      },
      currMonth: {
        newCamera: 592,
        activeCamera: 120,
        zombieCamera: 67,
        importantCamera: 130,
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
      terminalOwner: Array.from({ length: 6 }, () => ({ organiza: Random.pick(city) + 'xxx区级单位', count: Random.integer(10, 90), ratio: Random.integer(-8, 15) })),
      terminalOwner1: Array.from({ length: 6 }, () => ({ organiza: Random.pick(city), count: Random.integer(10, 90), ratio: Random.integer(-8, 15) })),
      cameraVisited: Array.from({ length: 6 }, () => ({ cameraId: Random.id(), count: Random.integer(10, 90), ratio: Random.integer(-8, 15) })),
    }
  },

  mounted() {
    try {
      this.initChart()
    } catch (error) {
      // pass
    }
    try {
      this.initChart2()
    } catch (error) {
      // pass
    }
  },

  methods: {
    ratioPerCamera: (a, b) => (a / (a + b)) * 100,
    ratioPerMonth: (a, b) => (((a - b) / b) * 100).toFixed(2),
    initChart() {
      const chart = echarts.init(this.$refs.chart)

      chart.setOption({
        title: { text: '单位摄像头布控位置' },
        legend: { orient: 'vertical', left: 'right', data: ['邯郸市xxx区级单位', '张家口市xxx区级单位'] },
        tooltip: {
          trigger: 'item',
        },
        radar: {
          indicator: Array.from({ length: posit.length }, (_, i) => ({ name: posit[i] })),
          center: ['50%', '50%'],
          splitArea: {
            areaStyle: {
              color: ['#ede9fe', '#ffedd5', '#d1fae5', '#e0f2fe'],
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10,
            },
          },
        },
        series: [
          {
            type: 'radar',
            emphasis: {
              focus: 'self',
              itemStyle: {
                color: 'rgba(0, 0, 0, 0)',
              },
            },
            data: [
              {
                value: Array.from({ length: posit.length }, () => Random.integer(50, 120)),
                name: '张家口市xxx区级单位',
                areaStyle: {
                  color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                    {
                      color: 'rgba(34, 21, 124, 0.1)',
                      offset: 0,
                    },
                    {
                      color: 'rgba(88, 221, 124, 0.9)',
                      offset: 1,
                    },
                  ]),
                },
              },
              {
                value: Array.from({ length: posit.length }, () => Random.integer(40, 120)),
                name: '邯郸市xxx区级单位',
                areaStyle: {
                  color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                    {
                      color: 'rgba(255, 145, 124, 0.1)',
                      offset: 0,
                    },
                    {
                      color: 'rgba(255, 145, 124, 0.9)',
                      offset: 1,
                    },
                  ]),
                },
              },
            ],
          },
        ],
      })
    },
    initChart2() {
      const chart = echarts.init(this.$refs.chart2)

      chart.setOption({
        title: { text: '被访问重点摄像头数据', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
        legend: [
          { orient: 'vertical', left: 'left', data: ['本月', '上月'] },
          { orient: 'vertical', left: 'right', data: ['活跃摄像头', '低活跃重点摄像头'] },
        ],
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
              { value: 335, name: '低活跃重点摄像头', itemStyle: { color: '#37A2DA' } },
              { value: 310, name: '活跃摄像头', itemStyle: { color: '#32C5E9' } },
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
              { value: 14, name: '低活跃重点摄像头', itemStyle: { color: '#E062AE' } },
              { value: 98, name: '活跃摄像头', itemStyle: { color: '#8378EA' } },
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

<style lang="scss" scoped></style>
