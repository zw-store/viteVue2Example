<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-26
 -->

<template>
  <el-form-item :label="name">
    <ColorBlock class="inline-block" :hex="inputColor" only-block></ColorBlock>

    <el-input class="!w-48" v-model="value" placeholder="请输入16进制颜色值" clearable @clear="result = []" @keydown.native.enter="handleColor">
      <div class="el-input__prefix" slot="prefix">
        <i style="display: inline-block; width: 25px">#</i>
      </div>
    </el-input>

    <el-button class="!ml-2.5" type="success" @click="handleColor" :disabled="!value">生成</el-button>
    <ColorRow ref="ColorRow" :colors="result" width="480px" @close="result = []"></ColorRow>
  </el-form-item>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorRow from './ColorRow.vue'
import ColorBlock from './ColorBlock.vue'

const toArray = obj => (Array.isArray(obj) ? obj : [obj])

export default {
  name: 'ColorControl',
  components: { ColorRow, ColorBlock },
  props: {
    name: { type: String, default: 'color' },
    func: { type: String, default: 'analogous' },
    args: undefined,
    static: { type: Boolean, default: false },
    color: { type: String, default: 'd9f99d' },
  },
  provide() {
    return {
      changeColor: this.changeColor,
    }
  },
  data() {
    return {
      value: this.color,
      result: [],
    }
  },

  methods: {
    changeColor(index, color) {
      this.result[index] = color
      this.result = this.result.slice()
    },
    handleColor() {
      const { value: colorValue, func, args } = this

      if (this.static) {
        const colors = Array.from({ length: args }, tinycolor[func])
        this.result = toArray(colors).map(x => x.toHexString())
      } else {
        const color = tinycolor(colorValue)[func](args)
        this.result = toArray(color).map(x => x.toHexString())
      }

      this.$nextTick(() => {
        this.$refs.ColorRow.$el.focus()
      })
    },
  },

  computed: {
    inputColor() {
      return tinycolor(this.value).toHexString()
    },
  },
}
</script>

<style lang="css" scoped></style>
