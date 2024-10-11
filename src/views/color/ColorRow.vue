<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-26
 -->

<template>
  <div tabindex="0" class="color-row" v-show="colors.length" :style="width && { width }">
    <i class="el-icon-close float-right cursor-pointer rounded-full hover:text-white hover:bg-sky-400" @click="$emit('close')"></i>

    <div class="color-block">
      <template v-for="(item, index) in colors">
        <ColorBlock :selected="selectedColorItem === index" @click.native="selectedColorItem = index" :changeColor="changeColor" :index="index" :hex="item" :key="index"></ColorBlock>
      </template>
    </div>
  </div>
</template>

<script>
import ColorBlock from './ColorBlock.vue'

export default {
  name: 'ColorRow',
  components: { ColorBlock },
  inheritAttrs: false,
  data() {
    return {
      selectedColorItem: false,
    }
  },
  props: {
    colors: { type: Array, required: true },
    width: { type: String, default: 'auto' },
  },
  inject: ['changeColor'],
  mounted() {
    this.$el.addEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    handleKeyDown(e) {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
    },
  },

  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.handleKeyDown)
  },
}
</script>

<style lang="scss" scoped>
.color-row {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-top: 10px;
  .color-block {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
}
</style>
