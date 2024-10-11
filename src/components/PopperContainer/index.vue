<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-13
 -->

<template>
  <div class="popper-container" v-clickoutside="handleClose">
    <div class="reference" ref="reference">
      <slot></slot>
    </div>

    <transition name="el-zoom-in-top">
      <dropdown ref="popper" v-show="_visible" :placement="placement">
        <slot name="popper"></slot>
      </dropdown>
    </transition>
  </div>
</template>

<script>
import dropdown from './dropdown'
import Clickoutside from './clickoutside'

export default {
  name: 'popper-container',
  components: { dropdown },
  directives: { Clickoutside },
  data() {
    return {
      reference: null,
    }
  },

  props: {
    visible: { type: Boolean },
    target: null,
    placement: null,
    popperClass: { type: String },
    popperStyle: { type: Object, default: () => ({}) },
  },

  mounted() {
    this.$nextTick(() => {
      this.reference = this.$refs.reference.$el
      if (this.target) {
        this.reference = this.target.$el
        this.$refs.popper.ready()
      }
    })
  },

  methods: {
    broadcast(componentName, eventName, params) {
      this.$refs[componentName].$emit(eventName, params)
    },

    handleClose({ mousedown }) {
      const clickPopperEl = Array.from(document.querySelectorAll('.el-popper')).some(popper => popper.contains(mousedown.target))

      !clickPopperEl && (this._visible = false)
    },
  },

  watch: {
    _visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.broadcast('popper', 'updatePopper')
        })
      } else {
        this.broadcast('popper', 'destroyPopper')
      }
    },
  },
  computed: {
    _visible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      },
    },
  },
  //  End
}
</script>

<style lang="scss" scoped>
.popper-container {
  position: relative;
  display: inline-block;
  .reference {
    position: relative;
  }
}
</style>
