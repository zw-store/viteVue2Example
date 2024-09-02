<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-28
 -->

<template>
  <div>
    <ScrollPanel style="width: 400px; height: 200px">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium praesentium eos cum sequi numquam debitis delectus quia, dolor molestiae provident sapiente excepturi nulla quisquam ab voluptas quaerat quidem. Quibusdam, facilis!</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium praesentium eos cum sequi numquam debitis delectus quia, dolor molestiae provident sapiente excepturi nulla quisquam ab voluptas quaerat quidem. Quibusdam, facilis!</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium praesentium eos cum sequi numquam debitis delectus quia, dolor molestiae provident sapiente excepturi nulla quisquam ab voluptas quaerat quidem. Quibusdam, facilis!</p>
    </ScrollPanel>
  </div>
</template>

<script>
import { Random } from 'mockjs'

export default {
  name: 'index',
  data() {
    return {
      images: [],
      integer: () => Random.integer(10, 20) + '0px',
      integerHeight: () => Random.integer(16, 24) + '0px',
      color: () => Random.color(),
    }
  },

  mounted() {
    // for (let i = 1; i <= 10; i++) {
    //   this.images.push({
    //     title: `image-${i}`,
    //     link: '',
    //     src: `https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.0.5/${i}.jpg`,
    //   })
    // }
  },

  methods: {},
  //  End
}
</script>

<style lang="css" scoped></style>
