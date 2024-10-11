<!--
  * Copyright ©
  * #
  * @author: zw
  * @date: 2024-09-13
  -->

<template>
  <div class="dropdown el-popper" :class="popperClass" :style="popperStyle">
    <slot></slot>
  </div>
</template>

<script>
import Popper from '../element-ui/popper'

export default {
  name: 'dropdown',
  mixins: [Popper],

  data() {
    return {}
  },

  props: {
    placement: { default: 'bottom-end' },
    boundariesPadding: { default: 0 },
    popperOptions: { default: () => ({ gpuAcceleration: false }) },
    visibleArrow: { default: true },
    appendToBody: { type: Boolean, default: true },
  },

  mounted() {
    this.$nextTick(this.ready)

    this.$on('updatePopper', () => {
      if (this.$parent._visible) this.updatePopper()
    })

    this.$on('destroyPopper', () => {
      this.destroyPopper
    })
  },

  methods: {
    ready() {
      this.referenceElm = this.$parent.$refs.reference
      this.popperElm = this.$el
    },
  },
  computed: {
    popperClass() {
      return this.$parent.popperClass
    },
    popperStyle() {
      return this.$parent.popperStyle
    },
  },
  //  End
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  z-index: 1001;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  min-width: 380px;
  min-height: 300px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
