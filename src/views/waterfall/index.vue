<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-01
 -->

<template>
  <Waterfall ref="waterfall" :gutter="10">
    <template v-for="(item, index) in Array.from({ length: 10 }, () => ({ color: rcolor(), width: integer(), height: integer() }))">
      <WaterfallItem :width="item.width" :height="item.height">
        <div style="height: 100%" :style="{ backgroundColor: item.color }">
          <p>{{ index }}</p>
          <p>width：{{ item.width }}</p>
          <p>height：{{ item.height }}</p>
        </div>
      </WaterfallItem>
    </template>
  </Waterfall>
</template>

<script>
import { Random } from 'mockjs'
import Waterfall from '@/components/Waterfall'
import WaterfallItem from '@/components/waterfall/WaterfallItem'

export default {
  name: 'index',
  components: { Waterfall, WaterfallItem },
  data() {
    return {
      integer: () => Random.integer(200, 300),
      rcolor: () => Random.color(),
    }
  },

  mounted() {},

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>
