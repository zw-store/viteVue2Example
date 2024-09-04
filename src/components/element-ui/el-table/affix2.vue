<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-03
 -->

<template>
  <div class="affix" :style="rootStyle">
    <div :class="{ 'affix-fixed': fixed }" :style="affixStyle">
      <slot />
    </div>
  </div>
</template>

<script>
function getScroller(el, root = window) {
  const overflowScrollReg = /scroll|auto|overlay/i

  let node = el

  while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1 && node !== root) {
    const _window$getComputedSt = window.getComputedStyle(node)
    const overflowY = _window$getComputedSt.overflowY
    if (overflowScrollReg.test(overflowY)) {
      return node
    }

    node = node.parentNode
  }

  return root
}
function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}
function getScrollTop(el) {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset // iOS 滚动反弹造成负滚动顶部
  return Math.max(top, 0)
}
function getElementTop(el, scroller) {
  if (!el) return 0
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop()
  return el.getBoundingClientRect().top + scrollTop
}
export default {
  name: 'Affix',
  props: {
    offset: { type: [String, Number], default: 0 },
    position: { type: String, default: 'top' },
    container: null,
    zIndex: { type: Number, default: 99 },
    disabled: Boolean,
  },
  data() {
    return {
      fixed: false,
      scrollTop: 0,
      transform: 0,
      scrollContainer: null,
      rootHeight: 0,
      rootWidth: 0,
      rootTop: 0,
      rootBottom: 0,
    }
  },
  mounted() {
    if (!this.scrollContainer) {
      this.scrollContainer = getScroller(this.$el)
      this.scrollContainer.addEventListener('scroll', this.handleScroll)
    }

    window.addEventListener('resize', this.updateRoot, { passive: true })
    window.addEventListener('scroll', this.unfixed, { passive: true, capture: true })

    this.updateRoot()
  },
  activated() {
    if (!this.scrollContainer) {
      this.scrollContainer = getScroller(this.$el)
      this.scrollContainer.addEventListener('scroll', this.handleScroll)
    }

    window.addEventListener('resize', this.updateRoot, { passive: true })
    window.addEventListener('scroll', this.unfixed, { passive: true, capture: true })

    this.updateRoot()
  },
  methods: {
    unfixed() {
      /** TODO
       * 疑惑：为什么 scroll 事件不会被销毁，而 resize 事件会被销毁？
       */
      if (this.fixed) {
        this.fixed = false
        this.transform = 0
      }
    },
    updateRoot() {
      this.rootHeight = this.$el.offsetHeight
      this.rootWidth = this.$el.offsetWidth
      this.rootTop = this.$el.getBoundingClientRect().top
      this.rootBottom = this.$el.getBoundingClientRect().bottom

      this.update()
    },
    update() {
      if (this.disabled) return
      if (!this.scrollContainer) return

      this.scrollTop = this.scrollContainer instanceof Window ? document.documentElement.scrollTop : this.scrollContainer.scrollTop || 0
      const offsetTop = getElementTop(this.scrollContainer)

      const offsetTopPx = this.offset + offsetTop

      if (this.position === 'top') {
        if (this.container) {
          const difference = this.container.getBoundingClientRect().bottom - offsetTopPx - this.rootHeight

          this.fixed = offsetTopPx > this.rootTop && this.container.getBoundingClientRect().bottom > offsetTop + this.rootHeight
          this.transform = difference < 0 ? difference : 0
        } else {
          this.fixed = offsetTopPx > this.rootTop
        }
      } else if (this.container) {
        const difference = window.innerHeight - this.container.getBoundingClientRect().top - offsetTopPx - this.rootHeight
        this.fixed = window.innerHeight - offsetTopPx < this.rootBottom && window.innerHeight > this.container.getBoundingClientRect().top
        this.transform = difference < 0 ? -difference : 0
      } else {
        this.fixed = window.innerHeight - offsetTopPx < this.rootBottom
      }
    },
    handleScroll() {
      this.updateRoot()
      this.$emit('scroll', {
        scrollTop: this.scrollTop,
        fixed: this.fixed,
      })
    },
    removeListener() {
      if (!this.scrollContainer) {
        this.scrollContainer = getScroller(this.$el)
        this.scrollContainer.removeEventListener('scroll', this.handleScroll)
      }
      window.removeEventListener('resize', this.updateRoot)
      window.removeEventListener('scroll', this.unfixed)
    },
  },
  computed: {
    rootStyle() {
      return {
        height: this.fixed ? `${this.rootHeight}px` : '',
        width: this.fixed ? `${this.rootWidth}px` : '',
      }
    },
    affixStyle() {
      if (!this.fixed) return {}

      const offsetTop = getElementTop(this.scrollContainer)
      const offsetTopPx = this.offset + offsetTop

      const offset = offsetTopPx ? parseInt(offsetTopPx) + 'px' : 0
      return {
        height: `${this.rootHeight}px`,
        width: `${this.rootWidth}px`,
        top: this.position === 'top' ? offset : '',
        bottom: this.position === 'bottom' ? offset : '',
        transform: this.transform ? `translateY(${this.transform}px)` : '',
        zIndex: this.zIndex,
      }
    },
  },
  beforeDestroy() {
    this.removeListener()
  },
  deactivated() {
    this.removeListener()
  },
}
</script>

<style scoped>
.affix-fixed {
  position: fixed;
}
</style>
