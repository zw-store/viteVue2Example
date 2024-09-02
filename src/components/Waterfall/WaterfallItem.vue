<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-30
 -->

<template>
  <div class="waterfall-item">
    <slot></slot>
  </div>
</template>

<script>
const isNumeric = val => /^\d+(\.\d+)?$/.test(val)

export default {
  name: 'WaterfallItem',
  data() {
    return {
      contentRect: {},
    }
  },

  props: {
    gutter: undefined,
    width: { type: [Number, String] },
    height: { type: [Number, String], default: 'auto' },
  },

  inject: ['owner'],

  mounted() {
    const observer = (this.observe = new ResizeObserver(params => {
      const contentRect = params[0].contentRect

      this.contentRect = contentRect
    }))

    observer.observe(this.$el)
    this.$nextTick(this.owner.layout)
  },

  methods: {
    addUnit(value) {
      if (value == null) return undefined

      value = String(value)
      return isNumeric(value) ? value + 'px' : value
    },
  },
  computed: {
    calcWidth() {
      const { owner } = this

      if (this.width) {
        return this.addUnit(this.width)
      }

      if (owner.column) {
        return `calc(${100 / owner.column}% - ${this.addUnit(this.marginBottom)})`
      }
    },
    calcHeight() {
      const h = this.addUnit(this.height)

      return h === 'auto' ? this.addUnit(this.contentRect.height) : h
    },
    marginBottom() {
      return this.gutter || this.owner.gutter
    },
  },

  destroyed() {
    this.observe.disconnect()
    this.observe = null
  },
  //  End
}
</script>

<style lang="scss" scoped>
.waterfall-item {
  margin-bottom: v-bind('`${marginBottom}px`');
  width: v-bind('calcWidth');
  height: v-bind('calcHeight');
  overflow: hidden;
  float: left;
}
</style>
