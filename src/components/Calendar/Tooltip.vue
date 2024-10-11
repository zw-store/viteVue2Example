<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-10-10
 -->

<template>
  <div class="calendar-tooltip" :style="styles">
    <span style="display: inline-block; margin-right: 4px; border-radius: 10px; width: 10px; height: 10px; background-color: #c9f279"></span> 登录<br />
    <span style="display: inline-block; margin-right: 4px; border-radius: 10px; width: 10px; height: 10px; background-color: #c9f279"></span>起始时间：2024-09-03 13:25:46 <br />
    <span style="display: inline-block; margin-right: 4px; border-radius: 10px; width: 10px; height: 10px; background-color: #c9f279"></span>结束时间：2024-09-06 14:34:02
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    tx: Number,
    ty: Number,
    px: Number,
    py: Number,
    visible: Boolean,
  },

  computed: {
    styles() {
      return {
        '--tooltip-px': this.px + 'px',
        '--tooltip-py': this.py + 'px',
        '--tooltip-tx': this.tx + 'px',
        '--tooltip-ty': this.ty + 'px',
        '--tooltip-visibility': this.visible ? 'visible' : 'hidden',
        '--tooltip-display': this.visible ? 'block' : 'none',
      }
    },
  },
  //  End
}
</script>

<style lang="scss" scoped>
.calendar-tooltip {
  position: absolute;
  top: var(--tooltip-py);
  left: var(--tooltip-px);
  z-index: 9999999;

  display: var(--tooltip-display);
  visibility: var(--tooltip-visibility);

  padding: 10px;
  border: 1px solid #c9f279;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px;

  white-space: nowrap;
  color: rgb(102, 102, 102);
  font-size: 14px;
  line-height: 21px;
  font-family: sans-serif;

  transform: translate3d(var(--tooltip-tx), var(--tooltip-ty), 0px);
  transition:
    opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1),
    visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  background-color: rgb(255, 255, 255);
}
</style>
