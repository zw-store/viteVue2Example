<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-30
 -->

<script lang="jsx">
import Masonry from 'masonry-layout'

export default {
  name: 'Waterfall',

  chilrenName: 'WaterfallItem',

  data() {
    return {
      masonry: null,
      _elements: [],
    }
  },

  props: {
    gutter: { type: Number, default: 16 },
    column: { type: Number, default: 4 },
  },

  provide() {
    return {
      owner: this,
    }
  },

  mounted() {
    this.initMasonry()
  },

  methods: {
    calcInstances() {
      const slots = this.$slots.default
      if (!slots) return []
      const elements = (this._elements = slots.filter(vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === this.$options.chilrenName))
      return elements
    },

    initMasonry() {
      const masonry = (this.masonry = new Masonry(this.$el, {
        itemSelector: '.waterfall-item',
        columnWidth: 10,
        transitionDuration: '0.8s',
        gutter: this.gutter,
        horizontalOrder: true,
        // initLayout: false,
        // percentPosition: true,
        resize: true,
        fitWidth: true,
      }))

      masonry.on('layoutComplete', items => {
        this.$emit('layoutComplete', items)
      })
    },
    layout() {
      this.masonry.layout()
    },
  },

  render() {
    const { calcInstances } = this
    return <div class="waterfall">{calcInstances()}</div>
  },
}
</script>

<style scoped>
.waterfall {
  width: 100% !important;
}
</style>
