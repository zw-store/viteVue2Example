<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-27
 -->

<template>
  <el-descriptions style="width: 300px" border size="mini" :title="`颜色 ${tooltipObject.hex}`" :column="1">
    <el-descriptions-item label="感知亮度">
      {{ tooltipObject.luminance }}
    </el-descriptions-item>

    <el-descriptions-item label="亮度(0-255)">
      {{ tooltipObject.brightness }}
    </el-descriptions-item>

    <el-descriptions-item label="透明度">
      {{ tooltipObject.alpha }}
    </el-descriptions-item>

    <el-descriptions-item label="hsv">
      {{ tooltipObject.hsv }}
    </el-descriptions-item>

    <el-descriptions-item label="hsl">
      {{ tooltipObject.hsl }}
    </el-descriptions-item>

    <el-descriptions-item label="hex">
      {{ tooltipObject.hex }}
    </el-descriptions-item>

    <el-descriptions-item label="hex8">
      {{ tooltipObject.hex8 }}
    </el-descriptions-item>

    <el-descriptions-item label="rgb">
      {{ tooltipObject.rgb }}
    </el-descriptions-item>

    <el-descriptions-item label="rgb百分比">
      {{ tooltipObject.rgbratio }}
    </el-descriptions-item>

    <template v-if="!onlyBlock">
      <el-descriptions-item label="减轻">
        <el-button type="text" @click="changeHex('lighten')">lighten+5</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="增亮">
        <el-button type="text" @click="changeHex('brighten')">brighten+5</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="变暗">
        <el-button type="text" @click="changeHex('darken')">darken+5</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="去饱和">
        <el-button type="text" @click="changeHex('desaturate')">desaturate+5</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="饱和">
        <el-button type="text" @click="changeHex('saturate')">saturate+5</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="灰度">
        <el-button type="text" @click="changeHex('greyscale')">greyscale+5</el-button>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script>
import tinycolor from 'tinycolor2'
export default {
  name: 'ColorTooltip',
  data() {
    return {
      tooltipObject: {},
    }
  },
  props: {
    hex: { type: String, required: true },
    index: Number,
    changeColor: { type: Function, default: () => {} },
    onlyBlock: Boolean,
  },
  mounted() {
    this.parseColor()
  },
  methods: {
    changeHex(func) {
      const color = tinycolor(this.tooltipObject.hex)
      const hexString = color[func](5).toHexString()
      this.changeColor(this.index, hexString)
      this.parseColor()
    },
    parseColor() {
      const { hex } = this
      const color = tinycolor(hex)
      const object = {}
      object.fromString = color.getFormat() // 获取颜色格式
      object.originString = color.getOriginalInput() // 原始值
      object.isValid = color.isValid() // 是否是颜色
      object.brightness = color.getBrightness() // 获取亮度值
      object.isLight = color.isLight() // 是否为亮色
      object.isDark = color.isDark() // 是否为暗色
      object.luminance = color.getLuminance() // 获取亮度
      object.alpha = color.getAlpha() // 获取透明度
      object.hsv = color.toHsvString() // 获取hsv值
      object.hsl = color.toHslString() // 获取hsl值
      object.hex = color.toHexString() // 获取hex值
      object.hex = color.toHexString() // 获取hex值
      object.hex8 = color.toHex8String() // 获取hex8值
      object.rgb = color.toRgbString() // 获取rgb值
      object.rgbratio = color.toPercentageRgbString() // 获取百分比rgb值

      this.tooltipObject = object
    },
  },
}
</script>

<style lang="css" scoped></style>
