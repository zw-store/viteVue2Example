<template>
  <el-row>
    <el-col :span="1.5">
      <slot v-if="$slots.default"></slot>

      <h4 v-else>{{ title }}</h4>
    </el-col>

    <el-col v-if="$slots.right" class="fr" :span="1.5">
      <slot name="right"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'CustomTitle',
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
}
</script>

<style lang="scss" scoped>
$default-font-color: #aaddff;
h4::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #23ebf8;
  border-radius: 2px;
  margin-right: 0.5rem;
}
h4 {
  height: 20px;
  line-height: 20px;
  margin: 0;
  padding: 0;
  font-weight: 400;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  color: $default-font-color;
}
</style>
