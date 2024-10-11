<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-26
 -->

<template>
  <div tabindex="0" class="color-row-cell" :class="selected && 'selected'">
    <el-tooltip popper-class="color-popper-tooltip" effect="light" placement="right-start">
      <div class="color-row-cell_block" :style="{ backgroundColor: hex }"></div>

      <ColorTooltip slot="content" v-bind="$props" :changeColor="changeColor"></ColorTooltip>
    </el-tooltip>

    <div v-if="$slots.default" class="color-row-cell_mark">
      <slot></slot>
    </div>

    <div v-if="!onlyBlock" class="color-row-cell_hex">{{ hex }}</div>
  </div>
</template>

<script>
import ColorTooltip from './ColorTooltip.vue'

export default {
  name: 'ColorBlock',
  components: { ColorTooltip },
  props: {
    hex: { type: String, default: '#000000' },
    index: Number,
    onlyBlock: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    changeColor: Function,
  },

  data() {
    return {
      visible: true,
    }
  },
}
</script>

<style lang="scss">
.color-row-cell {
  color: #64748b;
  border-radius: 4px;
  padding: 4px 2px 0px;
  border: 1px solid transparent;
  vertical-align: middle;
  &:hover {
    background-color: #f9fafb;
    border-radius: 4px;
  }

  &.selected,
  &:focus {
    border: 1px solid #d1d5db;
    background-color: #f9fafb;
    border-radius: 4px;
  }

  .color-row-cell_block {
    margin: 0 auto;
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
  .color-row-cell_mark {
    font-size: 12px;
    color: #0f172a;
  }
  .color-row-cell_hex {
    font-size: 12px;
    text-align: center;
  }
}
</style>

<style lang="scss">
.el-tooltip__popper.is-light.color-popper-tooltip {
  border: 1px solid #d1d5db;
  &[x-placement^='right'] .popper__arrow {
    border-right-color: #d1d5db !important;
  }
}
</style>
