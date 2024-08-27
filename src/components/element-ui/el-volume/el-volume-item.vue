<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-23
 -->

<template>
  <el-tooltip v-bind="$attrs" :disabled="!$slots.tooltip">
    <template #content>
      <slot name="tooltip"></slot>
    </template>

    <span class="el-volume-item">
      <slot v-bind="{ percentage, text, color }">
        {{ text }}
      </slot>
    </span>
  </el-tooltip>
</template>

<script>
const scheme = '2dd4bf818cf8c084fcf472b638bdf806b6d4a78bfa'.match(/.{6}/g).map(x => '#' + x)

let index = 0

export default {
  name: 'ElVolumeItem',
  props: {
    color: { type: String, default: () => scheme[index++ % scheme.length] },
    percentage: { type: Number, default: 0 },
    text: { type: String, default: '' },
    content: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
.el-volume-item {
  display: inline-block;
  width: v-bind('`${percentage}%`');
  text-align: center;
  height: 18px;
  font-size: 12px;
  line-height: 2;
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  background-color: v-bind('color');
  user-select: none;
  cursor: pointer;
}
</style>
