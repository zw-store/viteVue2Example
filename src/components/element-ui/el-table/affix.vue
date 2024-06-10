<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-06-05
 -->

<template>
  <div :style="{ height: fixed && $el.offsetHeight + 'px' }">
    <div :class="bem({ fixed })" :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<script>
function getRootFontSize() {
  let rootFontSize
  if (!rootFontSize) {
    const doc = document.documentElement
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize
    rootFontSize = parseFloat(fontSize)
  }

  return rootFontSize
}
function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}
function convertRem(value) {
  value = value.replace(/rem/g, '')
  return +value * getRootFontSize()
}
function convertVw(value) {
  value = value.replace(/vw/g, '')
  return (+value * window.innerWidth) / 100
}
function convertVh(value) {
  value = value.replace(/vh/g, '')
  return (+value * window.innerHeight) / 100
}
function unitToPx(value) {
  if (typeof value === 'number') {
    return value
  }
  if (value.indexOf('rem') !== -1) {
    return convertRem(value)
  }

  if (value.indexOf('vw') !== -1) {
    return convertVw(value)
  }

  if (value.indexOf('vh') !== -1) {
    return convertVh(value)
  }

  return parseFloat(value)
}
function isHidden(el) {
  const style = window.getComputedStyle(el)
  const hidden = style.display === 'none' // offset Parent 在以下情况下返回 null:
  // 1. 元素或其父元素的display属性设置为none.
  // 2. 元素的position属性设置为fixed

  const parentHidden = el.offsetParent === null && style.position !== 'fixed'
  return hidden || parentHidden
}
function getElementTop(el, scroller) {
  if (!el) return 0
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop()
  return el.getBoundingClientRect().top + scrollTop
}
function getScrollTop(el) {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset // iOS 滚动反弹造成负滚动顶部
  return Math.max(top, 0)
}
function getScroller(el, root = window) {
  const overflowScrollReg = /scroll|auto/i

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
export default {
  name: 'affix',
  data() {
    return {
      scroller: null,
      observer: null,
      top: 0,
      fixed: false,
      transform: 0,
    }
  },
  props: {
    container: null,
    zIndex: [Number, String],
    offsetTop: { type: [Number, String], default: 0 },
    disabled: Boolean,
  },
  created() {
    const options = { root: document.body }
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio > 0) {
        this.onScroll()
      }
    }, options)
  },
  mounted() {
    if (!this.scroller) {
      this.scroller = getScroller(this.$el)
    }
    if (this.observer) {
      this.observer['observe'](this.$el)
    }
    this.bindFn(handler => {
      handler(this.scroller, 'scroll', this.onScroll, {
        capture: false,
        passive: true,
      })
    })
    this.onScroll()
  },
  activated() {
    if (!this.scroller) {
      this.scroller = getScroller(this.$el)
    }
    if (this.observer) {
      this.observer['observe'](this.$el)
    }
    this.bindFn(handler => {
      handler(this.scroller, 'scroll', this.onScroll, {
        capture: false,
        passive: true,
      })
    })
    this.onScroll()
  },
  methods: {
    onScroll(e) {
      if (this.disabled) return
      if (isHidden(this.$el)) return

      const { container, offsetTopPx } = this
      const height = this.$el.offsetHeight
      const scrollTop = e?.target ? getScrollTop(e.target) : getScrollTop(window)
      const scrollerTop = getScrollTop(this.scroller)
      const topToPageTop = getElementTop(this.$el, this.scroller)

      const emitScrollEvent = () => {
        this.$emit('scroll', { scrollTop: scrollTop, isFixed: this.fixed })
      }

      if (container) {
        const { offsetHeight } = container
        const bottomToPageTop = topToPageTop + offsetHeight + scrollerTop

        if (scrollTop + offsetTopPx + height > bottomToPageTop) {
          const distanceToBottom = height + scrollTop - bottomToPageTop

          if (distanceToBottom < height) {
            this.fixed = true
            this.transform = -(distanceToBottom + offsetTopPx)
          } else {
            this.fixed = false
          }

          emitScrollEvent()
          return
        }
      }
      if (scrollTop + offsetTopPx > topToPageTop - height) {
        this.fixed = true
        this.transform = 0
      } else {
        this.fixed = false
      }

      emitScrollEvent()
    },
    bindFn(handler) {
      handler.call(
        this,
        (target, event, handler, passive) => {
          if (!passive) passive = false
          target.addEventListener(event, handler, passive)
        },
        true,
      )
    },
    unBindFn() {
      if (!this.scroller) {
        this.scroller = getScroller(this.$el)
      }

      if (this.observer) {
        this.observer['unobserve'](this.$el)
      }
      this.scroller.removeEventListener('scroll', this.onScroll)
    },
    createBem(name) {
      return function (el, mods) {
        function gen(name, mods) {
          if (!mods) return ''
          if (typeof mods === 'string') return ' ' + name + '--' + mods
          if (Array.isArray(mods)) return mods.reduce((ret, item) => ret + gen(name, item), '')
          return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '')
        }

        if (el && typeof el !== 'string') {
          mods = el
          el = ''
        }

        el = el ? name + '__' + el : name
        return '' + el + gen(el, mods)
      }
    },
  },
  computed: {
    offsetTopPx() {
      return unitToPx(this.offsetTop)
    },
    style() {
      if (!this.fixed) return

      const style = {
        top: this.scroller ? getElementTop(this.scroller) + 'px' : 0,
      }

      if (this.zIndex == null) style.zIndex = this.zIndex

      if (this.offsetTopPx && this.fixed) {
        style.top = parseInt(style.top) + this.offsetTopPx + 'px'
      }

      if (this.transform) {
        style.transform = 'translate3d(0, ' + this.transform + 'px, 0)'
      }

      return style
    },
    bem() {
      return (...cls) => this.createBem(this.$options.name)(...cls)
    },
  },
  beforeDestroy() {
    this.unBindFn()
  },
  deactivated() {
    this.unBindFn()
  },
  //  End
}
</script>

<style lang="css" scoped>
.affix--fixed {
  position: fixed;
  z-index: 99;
}
</style>
