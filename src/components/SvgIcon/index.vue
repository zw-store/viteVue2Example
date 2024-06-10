<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-06-03
 -->

<template>
  <svg :class="svgClass" aria-hidden="true" style="display: inline-block">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
export default {
  props: {
    iconClass: { type: String, required: true },
    className: { type: String, default: '' },
    color: { type: String, default: '' },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`
      }
      return 'svg-icon'
    },
  },
}
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
