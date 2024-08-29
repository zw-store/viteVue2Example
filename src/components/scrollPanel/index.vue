<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-08-28
 -->

<template>
  <div class="scrollpanel">
    <div class="scrollpanel-content-container">
      <div ref="content" :id="contentId" class="scrollpanel-content" @scroll="onScroll" @mouseenter="moveBar">
        <slot></slot>
      </div>
    </div>

    <div ref="xBar" class="scrollpanel-bar scrollpanel-bar-x" tabindex="0" @mousedown="onXBarMouseDown" @keydown="onKeyDown($event)" @keyup="onKeyUp" @focus="onFocus" @blur="onBlur"></div>
    <div ref="yBar" class="scrollpanel-bar scrollpanel-bar-y" tabindex="0" @mousedown="onYBarMouseDown" @keydown="onKeyDown($event)" @keyup="onKeyUp" @focus="onFocus"></div>
  </div>
</template>

<script>
function hasClass(element, className) {
  if (element) {
    if (element.classList) return element.classList.contains(className)
    else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)
  }
  return false
}
function addClass(element, className) {
  if (element && className) {
    const fn = _className => {
      if (!hasClass(element, _className)) {
        if (element.classList) element.classList.add(_className)
        else element.className += ' ' + _className
      }
    }
    ;[className]
      .flat()
      .filter(Boolean)
      .forEach(_classNames => _classNames.split(' ').forEach(fn))
  }
}
function removeClass(element, className) {
  if (element && className) {
    const fn = _className => {
      if (element.classList) element.classList.remove(_className)
      else element.className = element.className.replace(new RegExp('(^|\\b)' + _className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
    ;[className]
      .flat()
      .filter(Boolean)
      .forEach(_classNames => _classNames.split(' ').forEach(fn))
  }
}
function getHeight(element) {
  if (element) {
    let height = element.offsetHeight
    const style = getComputedStyle(element)
    height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
    return height
  }
  return 0
}
const raf = window.requestAnimationFrame || window.setTimeout

export default {
  name: 'ScrollPanel',
  data() {
    return {
      initialized: false,
      documentResizeListener: null,
      documentMouseMoveListener: null,
      documentMouseUpListener: null,
      frame: null,
      scrollXRatio: null,
      scrollYRatio: null,
      isXBarClicked: false,
      isYBarClicked: false,
      lastPageX: null,
      lastPageY: null,
      timer: null,

      id: this.$attrs.id,
      orientation: 'vertical',
      lastScrollTop: 0,
      lastScrollLeft: 0,
    }
  },
  props: {
    step: { type: Number, default: 5 },
  },
  mounted() {
    this.id = this.id || Date.now().toString(36) + Math.random().toString(36).substr(2)

    if (this.$el.offsetParent) {
      this.initialize()
    }
  },

  methods: {
    initialize() {
      this.moveBar()
      this.bindDocumentResizeListener()
      this.calculateContainerHeight()
    },
    onScroll(event) {
      if (this.lastScrollLeft !== event.target.scrollLeft) {
        this.lastScrollLeft = event.target.scrollLeft
        this.orientation = 'horizontal'
      } else if (this.lastScrollTop !== event.target.scrollTop) {
        this.lastScrollTop = event.target.scrollTop
        this.orientation = 'vertical'
      }

      this.moveBar()
    },
    moveBar() {
      if (this.$refs.content) {
        /* horizontal scroll */
        const totalWidth = this.$refs.content.scrollWidth
        const ownWidth = this.$refs.content.clientWidth
        const bottom = (this.$el.clientHeight - this.$refs.xBar.clientHeight) * -1

        this.scrollXRatio = ownWidth / totalWidth

        /* vertical scroll */
        const totalHeight = this.$refs.content.scrollHeight
        const ownHeight = this.$refs.content.clientHeight
        const right = (this.$el.clientWidth - this.$refs.yBar.clientWidth) * -1

        this.scrollYRatio = ownHeight / totalHeight

        this.frame = raf(() => {
          if (this.$refs.xBar) {
            if (this.scrollXRatio >= 1) {
              !this.isUnstyled && addClass(this.$refs.xBar, 'scrollpanel-hidden')
            } else {
              !this.isUnstyled && removeClass(this.$refs.xBar, 'scrollpanel-hidden')
              this.$refs.xBar.style.cssText = 'width:' + Math.max(this.scrollXRatio * 100, 10) + '%; left:' + (this.$refs.content.scrollLeft / totalWidth) * 100 + '%;bottom:' + bottom + 'px;'
            }
          }

          if (this.$refs.yBar) {
            if (this.scrollYRatio >= 1) {
              !this.isUnstyled && addClass(this.$refs.yBar, 'scrollpanel-hidden')
            } else {
              !this.isUnstyled && removeClass(this.$refs.yBar, 'scrollpanel-hidden')
              this.$refs.yBar.style.cssText = 'height:' + Math.max(this.scrollYRatio * 100, 10) + '%; top: calc(' + (this.$refs.content.scrollTop / totalHeight) * 100 + '% - ' + this.$refs.xBar.clientHeight + 'px);right:' + right + 'px;'
            }
          }
        })
      }
    },
    calculateContainerHeight() {
      const containerStyles = getComputedStyle(this.$el)
      const xBarStyles = getComputedStyle(this.$refs.xBar)
      const pureContainerHeight = getHeight(this.$el) - parseInt(xBarStyles['height'], 10)

      if (containerStyles['max-height'] !== 'none' && pureContainerHeight === 0) {
        if (this.$refs.content.offsetHeight + parseInt(xBarStyles['height'], 10) > parseInt(containerStyles['max-height'], 10)) {
          this.$el.style.height = containerStyles['max-height']
        } else {
          this.$el.style.height = this.$refs.content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + 'px'
        }
      }
    },
    onXBarMouseDown(e) {
      this.isXBarClicked = true
      this.$refs.xBar.focus()
      this.lastPageX = e.pageX
      !this.isUnstyled && addClass(this.$refs.xBar, 'scrollpanel-grabbed')
      !this.isUnstyled && addClass(document.body, 'scrollpanel-grabbed')

      this.bindDocumentMouseListeners()
      e.preventDefault()
    },
    onYBarMouseDown(e) {
      this.isYBarClicked = true
      this.$refs.yBar.focus()
      this.lastPageY = e.pageY
      !this.isUnstyled && addClass(this.$refs.yBar, 'scrollpanel-grabbed')
      !this.isUnstyled && addClass(document.body, 'scrollpanel-grabbed')

      this.bindDocumentMouseListeners()
      e.preventDefault()
    },
    onMouseMoveForXBar(e) {
      const deltaX = e.pageX - this.lastPageX

      this.lastPageX = e.pageX

      this.frame = raf(() => {
        this.$refs.content.scrollLeft += deltaX / this.scrollXRatio
      })
    },
    onMouseMoveForYBar(e) {
      const deltaY = e.pageY - this.lastPageY

      this.lastPageY = e.pageY

      this.frame = raf(() => {
        this.$refs.content.scrollTop += deltaY / this.scrollYRatio
      })
    },
    onDocumentMouseMove(e) {
      if (this.isXBarClicked) {
        this.onMouseMoveForXBar(e)
      } else if (this.isYBarClicked) {
        this.onMouseMoveForYBar(e)
      } else {
        this.onMouseMoveForXBar(e)
        this.onMouseMoveForYBar(e)
      }
    },
    onDocumentMouseUp() {
      !this.isUnstyled && removeClass(this.$refs.yBar, 'scrollpanel-grabbed')
      !this.isUnstyled && removeClass(this.$refs.xBar, 'scrollpanel-grabbed')
      !this.isUnstyled && removeClass(document.body, 'scrollpanel-grabbed')

      this.unbindDocumentMouseListeners()
      this.isXBarClicked = false
      this.isYBarClicked = false
    },
    repeat(bar, step) {
      this.$refs.content[bar] += step
      this.moveBar()
    },
    setTimer(bar, step) {
      this.clearTimer()
      this.timer = setTimeout(() => {
        this.repeat(bar, step)
      }, 40)
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    onKeyDown(event) {
      if (this.orientation === 'vertical') {
        switch (event.code) {
          case 'ArrowDown': {
            this.setTimer('scrollTop', this.step)
            event.preventDefault()
            break
          }

          case 'ArrowUp': {
            this.setTimer('scrollTop', this.step * -1)
            event.preventDefault()
            break
          }

          case 'ArrowLeft':
          case 'ArrowRight': {
            event.preventDefault()
            break
          }

          default:
            // no op
            break
        }
      } else if (this.orientation === 'horizontal') {
        switch (event.code) {
          case 'ArrowRight': {
            this.setTimer('scrollLeft', this.step)
            event.preventDefault()
            break
          }

          case 'ArrowLeft': {
            this.setTimer('scrollLeft', this.step * -1)
            event.preventDefault()
            break
          }

          case 'ArrowDown':
          case 'ArrowUp': {
            event.preventDefault()
            break
          }

          default:
            // no op
            break
        }
      }
    },
    onKeyUp() {
      this.clearTimer()
    },
    onFocus(event) {
      if (this.$refs.xBar.isSameNode(event.target)) {
        this.orientation = 'horizontal'
      } else if (this.$refs.yBar.isSameNode(event.target)) {
        this.orientation = 'vertical'
      }
    },
    onBlur() {
      if (this.orientation === 'horizontal') {
        this.orientation = 'vertical'
      }
    },
    refresh() {
      this.moveBar()
    },
    scrollTop(scrollTop) {
      const scrollableHeight = this.$refs.content.scrollHeight - this.$refs.content.clientHeight

      scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0
      this.$refs.content.scrollTop = scrollTop
    },
    bindDocumentMouseListeners() {
      if (!this.documentMouseMoveListener) {
        this.documentMouseMoveListener = this.onDocumentMouseMove

        document.addEventListener('mousemove', this.documentMouseMoveListener)
      }

      if (!this.documentMouseUpListener) {
        this.documentMouseUpListener = this.onDocumentMouseUp

        document.addEventListener('mouseup', this.documentMouseUpListener)
      }
    },
    unbindDocumentMouseListeners() {
      if (this.documentMouseMoveListener) {
        document.removeEventListener('mousemove', this.documentMouseMoveListener)
        this.documentMouseMoveListener = null
      }

      if (this.documentMouseUpListener) {
        document.removeEventListener('mouseup', this.documentMouseUpListener)
        this.documentMouseUpListener = null
      }
    },
    bindDocumentResizeListener() {
      if (!this.documentResizeListener) {
        this.documentResizeListener = () => {
          this.moveBar()
        }

        window.addEventListener('resize', this.documentResizeListener)
      }
    },
    unbindDocumentResizeListener() {
      if (this.documentResizeListener) {
        window.removeEventListener('resize', this.documentResizeListener)
        this.documentResizeListener = null
      }
    },
  },

  updated() {
    if (!this.initialized && this.$el.offsetParent) {
      this.initialize()
    }
  },

  computed: {
    contentId() {
      return this.id + '_content'
    },
  },

  watch: {
    '$attrs.id': function (newValue) {
      this.id = newValue || Date.now().toString(36) + Math.random().toString(36).substr(2)
    },
  },

  beforeDestroy() {
    this.unbindDocumentResizeListener()

    if (this.frame) {
      window.cancelAnimationFrame(this.frame)
    }
  },
  //  End
}
</script>

<style lang="scss" scoped>
.scrollpanel-content-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  float: left;
}

.scrollpanel-content {
  height: calc(100% + calc(2 * 9px));
  width: calc(100% + calc(2 * 9px));
  padding: 0 calc(2 * 9px) calc(2 * 9px) 0;
  position: relative;
  overflow: auto;
  box-sizing: border-box;
  scrollbar-width: none;
}

.scrollpanel-content::-webkit-scrollbar {
  display: none;
}

.scrollpanel-bar {
  position: relative;
  border-radius: 4px;
  z-index: 2;
  cursor: pointer;
  opacity: 0;
  outline-color: transparent;
  transition: outline-color 0.2s;
  background-color: #d4d4d4;
  border: 0 none;
  transition:
    outline-color 0.2s,
    opacity 0.2s;
}

.scrollpanel-bar:focus-visible {
  box-shadow: none;
  outline: 0px solid #020617;
  outline-offset: 0;
}

.scrollpanel-bar-y {
  width: 9px;
  top: 0;
}

.scrollpanel-bar-x {
  height: 9px;
  bottom: 0;
}

.scrollpanel-hidden {
  visibility: hidden;
}

.scrollpanel:hover .scrollpanel-bar,
.scrollpanel:active .scrollpanel-bar {
  opacity: 1;
}

.scrollpanel-grabbed {
  user-select: none;
}
</style>
