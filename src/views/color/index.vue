<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-25
 -->

<template>
  <el-row>
    <el-col :span="10">
      <el-form size="mini" label-width="80px" @submit.native.prevent>
        <el-form-item label="测试颜色">
          <ColorBlock class="inline-block" :hex="testColor"></ColorBlock>
        </el-form-item>

        <template v-for="item in config">
          <ColorControl v-bind="item"></ColorControl>
        </template>
      </el-form>
    </el-col>

    <el-col :span="14">
      <ColorPanel></ColorPanel>
    </el-col>
  </el-row>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorPanel from './ColorPanel.vue'
import ColorControl from './ColorControl.vue'
import ColorBlock from './ColorBlock.vue'
const ccc = '#f2f8fe'

export default {
  name: 'Color',
  components: { ColorPanel, ColorControl, ColorBlock },
  data() {
    return {
      config: [
        { color: 'ef4444', name: '系列颜色', func: 'analogous', args: 6 },
        { color: 'fb923c', name: '分裂补体', func: 'splitcomplement', args: 6 },
        { color: 'facc15', name: '三合会', func: 'triad', args: undefined },
        { color: '4ade80', name: '四分体', func: 'tetrad', args: undefined },
        { color: '22d3ee', name: '补充', func: 'complement', args: undefined },
        { color: '#000', name: '随机色', func: 'random', args: 6, static: true },
      ],
      // 不改变外貌的情况下改变0.5的透明度
      testColor: tinycolor(ccc).spin(80).toHex8String(),
    }
  },
}
</script>

<style lang="scss" scoped></style>
