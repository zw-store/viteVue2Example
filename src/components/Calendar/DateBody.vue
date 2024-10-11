<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-09-27
 -->

<template>
  <table v-highlight-background v-interaction-range :class="['el-calendar-table', { 'is-range': isInRange }]" cellspacing="0" cellpadding="0">
    <thead v-if="hideHeader">
      <th v-for="(day, index) in weekDays" :data-column-index="index" :key="day">{{ day }}</th>
    </thead>

    <tbody ref="tbody" v-tooltip>
      <tr :class="['el-calendar-table__row', { 'el-calendar-table__row--hide-border': index === 0 && hideHeader }]" v-for="(row, index) in rows" :key="index">
        <td :class="[...getCellClass(cell), { 'highlight-selected': cell.selected }]" :data-row-index="index" :data-column-index="key" :data-date="getFormateDate(cell.text, cell.type)" v-for="(cell, key) in row" :key="getFormateDate(cell.text, cell.type).day" @click="pickDay(cell, index, key)">
          <div class="el-calendar-day">
            <FragmentBlock :cell="cell" :getFormateDate="getFormateDate"></FragmentBlock>
          </div>
        </td>
      </tr>

      <Tooltip ref="tooltip" v-bind="tooltip"></Tooltip>
    </tbody>
  </table>
</template>

<script lang="jsx">
import { getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays, validateRangeInOneMonth } from 'element-ui/src/utils/date-util'
import fecha from 'element-ui/src/utils/date'
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom'
import Heatmap from './heatmap'
import Tooltip from './Tooltip'

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
const validValue = (min, max, value) => Math.max(min, Math.min(max, value))

function doubleHandler(fn, delay) {
  let singleClickTimer

  function _doubleClickHandler() {
    clearTimeout(singleClickTimer)
    singleClickTimer = setTimeout(() => {
      fn.call(this, ...arguments)
    }, delay || 0)
  }

  const cancelDoubleHandler = () => {
    clearTimeout(singleClickTimer)
  }

  return [_doubleClickHandler, cancelDoubleHandler]
}

export default {
  name: 'DateBody',
  components: {
    Tooltip,
    FragmentBlock: {
      props: {
        cell: Object,
        getFormateDate: Function,
        rowIndex: Number,
        columnIndex: Number,
      },
      inject: ['Calendar'],
      render() {
        const { text, type, selected } = this.cell
        const render = this.Calendar.$scopedSlots.dateCell || this.Calendar.$scopedSlots.cell
        if (!render) return <span>{text}</span>

        const day = this.getFormateDate(text, type)
        const date = new Date(day)
        const data = { selected, type: `${type}-month`, day }
        return render({ date, data })
      },
    },
  },

  data() {
    return {
      rows: [],
      tooltip: {
        tx: 0,
        ty: 0,
        px: 0,
        py: 0,
        visible: false,
        disabled: false,
      },
      pointMapping: new Map(),
    }
  },

  props: {
    range: {
      type: Array,
      validator(val) {
        if (!(val && val.length)) return true
        const [start, end] = val
        return validateRangeInOneMonth(start, end)
      },
    },
    date: Date,
    selectedDay: String,
    hideHeader: { type: Boolean, default: true },
    firstDayOfWeek: Number,
  },

  inject: ['Calendar'],

  created() {
    this.generateDate()
  },

  mounted() {
    this.heatmap = Heatmap.create({
      container: this.$refs.tbody,
      radius: 40,
      maxOpacity: 0.7,
      minOpacity: 0,
      blur: 0.75,
      gradient: { 0.25: 'rgba(0,0,255, 0.5)', 0.55: 'rgba(0,255,0, 0.5)', 0.85: 'rgb(255, 255, 0)', 1.0: 'rgba(255,0,0, 0.5)' },
    })

    this.generateheatmapDate()
  },

  methods: {
    generateheatmapDate() {
      const tds = this.$refs.tbody.querySelectorAll('td.current')
      for (let i = 0; i < tds.length; i++) {
        const item = tds[i]
        const px = item.offsetLeft + item.offsetWidth / 2
        const py = item.offsetTop + item.offsetHeight / 2
        if (Math.random() > 0.5) {
          this.heatmap.addData([{ x: ~~px, y: ~~py, value: ~~(Math.random() * 10) }])
        }
      }
    },
    generateDate() {
      let days = []
      if (this.isInRange) {
        const [start, end] = this.range
        const currentMonthRange = Array.from({ length: end.getDate() - start.getDate() + 1 }, (_, index) => ({ text: start.getDate() + index, type: 'current' }))
        let remaining = currentMonthRange.length % 7
        remaining = remaining === 0 ? 0 : 7 - remaining
        const nextMonthRange = Array.from({ length: remaining }, (_, index) => ({ text: index + 1, type: 'next' }))
        days = currentMonthRange.concat(nextMonthRange)
      } else {
        const date = this.date
        let firstDay = getFirstDayOfMonth(date)
        firstDay = firstDay === 0 ? 7 : firstDay
        const firstDayOfWeek = typeof this.firstDayOfWeek === 'number' ? this.firstDayOfWeek : 1
        const offset = (7 + firstDay - firstDayOfWeek) % 7
        const prevMonthDays = getPrevMonthLastDays(date, offset).map(day => ({ text: day, type: 'prev' }))
        const currentMonthDays = getMonthDays(date).map(day => ({ text: day, type: 'current' }))
        days = [...prevMonthDays, ...currentMonthDays]
        const nextMonthDays = Array.from({ length: 42 - days.length }, (_, index) => ({ text: index + 1, type: 'next' }))
        days = [...days, ...nextMonthDays]
      }

      days.forEach(x => (x.selected = false))
      this.rows = Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7))
    },
    getFormateDate(day, type) {
      if (!day || !['prev', 'current', 'next'].includes(type)) {
        throw new Error('invalid day or type')
      }

      const { curMonthDatePrefix, prevMonthDatePrefix, nextMonthDatePrefix } = this

      switch (type) {
        case 'prev':
          return `${prevMonthDatePrefix}-${String(day).padStart(2, '0')}`

        case 'next':
          return `${nextMonthDatePrefix}-${String(day).padStart(2, '0')}`

        default:
          return `${curMonthDatePrefix}-${String(day).padStart(2, '0')}`
      }
    },
    getCellClass({ text, type }) {
      const classes = [type]
      if (type === 'current') {
        const date = this.getFormateDate(text, type)
        if (date === this.selectedDay) {
          // classes.push('is-selected')
        }
        if (date === this.Calendar.formatedToday) {
          classes.push('is-today')
        }
      }
      return classes
    },
    pickDay(cell, _rowIndex, _columnIndex) {
      cell.selected = !cell.selected
    },
    rangeDay(cell, _rowIndex, _columnIndex) {
      cell.selected = true
    },
    unrangeDay(cell, _rowIndex, _columnIndex) {
      cell.selected = false
    },
  },

  computed: {
    isInRange() {
      return this.range && this.range.length
    },
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime())
      temp.setDate(0)
      return fecha.format(temp, 'yyyy-MM')
    },
    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM')
    },
    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1)
      return fecha.format(temp, 'yyyy-MM')
    },
    weekDays() {
      const start = this.firstDayOfWeek

      if (typeof start !== 'number' || start === 0) {
        return WEEK_DAYS.slice()
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start))
      }
    },
  },

  directives: {
    highlightBackground: {
      bind(el, _binding) {
        const handleCellBackgroundOver = (cells, rowIndex, columnIndex, cb) => {
          for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            const columnIndexByForLoop = cell.getAttribute('data-column-index')
            const rowIndexByForLoop = cell.getAttribute('data-row-index')

            if (columnIndexByForLoop === columnIndex) {
              if (!hasClass(cell, 'highlight-cell')) {
                addClass(cell, 'highlight-cell')

                if (cb && typeof cb === 'function') cb()
              }
            }

            if (rowIndexByForLoop === rowIndex) {
              if (!hasClass(cell, 'highlight-cell')) {
                addClass(cell, 'highlight-cell')
              }
            }
          }
        }

        const handleCellBackgroundByOut = (cells, cb) => {
          for (let i = 0; i < cells.length; i++) {
            const _cell = cells[i]
            if (hasClass(_cell, 'highlight-cell')) {
              removeClass(_cell, 'highlight-cell')
              if (cb && typeof cb === 'function') cb()
            }
          }
        }

        const __calendar_channel_transmit_enter__ = (el.__calendar_channel_transmit_enter__ = event => {
          const th_cells = el.querySelectorAll('th')
          const td_cells = el.querySelectorAll('td')
          const { rowIndex, columnIndex } = event.detail

          handleCellBackgroundOver(th_cells, rowIndex, columnIndex)
          handleCellBackgroundOver(td_cells, rowIndex, columnIndex)
        })

        const __calendar_channel_transmit_leave__ = (el.__calendar_channel_transmit_leave__ = _ => {
          const th_cells = el.querySelectorAll('th')
          const td_cells = el.querySelectorAll('td')

          handleCellBackgroundByOut(th_cells)
          handleCellBackgroundByOut(td_cells)
        })

        window.addEventListener('__calendar_channel_transmit_enter__', __calendar_channel_transmit_enter__, false)
        window.addEventListener('__calendar_channel_transmit_leave__', __calendar_channel_transmit_leave__, false)

        const mouseover = (el.__bind_mouseover_func = e => {
          const cell = e.target.closest('td') || e.target.closest('th')
          if (!cell) return

          const th_cells = el.querySelectorAll('th')
          const td_cells = el.querySelectorAll('td')
          const rowIndex = cell.getAttribute('data-row-index')
          const columnIndex = cell.getAttribute('data-column-index')
          if (columnIndex === null) return

          handleCellBackgroundOver(th_cells, rowIndex, columnIndex, () => {
            window.dispatchEvent(
              new CustomEvent('__calendar_channel_transmit_enter__', {
                detail: { rowIndex, columnIndex },
                bubbles: false,
                cancelable: true,
              }),
            )
          })

          handleCellBackgroundOver(td_cells, rowIndex, columnIndex, () => {
            window.dispatchEvent(
              new CustomEvent('__calendar_channel_transmit_enter__', {
                detail: { rowIndex, columnIndex },
                bubbles: false,
                cancelable: true,
              }),
            )
          })
        })

        const mouseout = (el.__bind_mouseout_func = e => {
          const cell = e.target.closest('td') || e.target.closest('th')
          if (!cell) return

          const th_cells = el.querySelectorAll('th')
          const td_cells = el.querySelectorAll('td')

          handleCellBackgroundByOut(th_cells, () => {
            window.dispatchEvent(
              new CustomEvent('__calendar_channel_transmit_leave__', {
                detail: {},
                bubbles: false,
                cancelable: true,
              }),
            )
          })

          handleCellBackgroundByOut(td_cells, () => {
            window.dispatchEvent(
              new CustomEvent('__calendar_channel_transmit_leave__', {
                detail: {},
                bubbles: false,
                cancelable: true,
              }),
            )
          })
        })

        el.addEventListener('mouseover', mouseover)
        el.addEventListener('mouseout', mouseout)
      },

      unbind(el) {
        const mouseover = el.__bind_mouseover_func
        const mouseout = el.__bind_mouseout_func
        const __calendar_channel_transmit_enter__ = el.__calendar_channel_transmit_enter__
        const __calendar_channel_transmit_leave__ = el.__calendar_channel_transmit_leave__

        el.removeEventListener('mouseover', mouseover)
        el.removeEventListener('mouseout', mouseout)
        window.removeEventListener('__calendar_channel_transmit_enter__', __calendar_channel_transmit_enter__)
        window.removeEventListener('__calendar_channel_transmit_leave__', __calendar_channel_transmit_leave__)
      },
    },

    interactionRange: {
      bind(el, _binding, vnode) {
        const { context } = vnode
        const mousedown = (el.__bind_mousedown_func = e => {
          context.tooltip.disabled = true
          context.tooltip.visible = false

          document.body.style.cursor = 'grabbing'
          document.body.style.userSelect = 'none'

          const sx = e.clientX
          const sy = e.clientY

          const odiv = document.createElement('div')
          odiv.style.position = 'fixed'
          odiv.style.zIndex = '9999'
          odiv.style.backgroundColor = '#93c5fd50'
          odiv.style.pointerEvents = 'none'
          odiv.style.border = '1px solid #93c5fd'
          document.body.appendChild(odiv)

          const intersects = (rect, rect2) => {
            return !(rect.top > rect2.bottom || rect.bottom < rect2.top || rect.left > rect2.right || rect.right < rect2.left)
          }

          const validValue = (min, max, value) => Math.min(Math.max(min, value), max)
          const tbodyRect = el.querySelector('tbody').getBoundingClientRect()
          const collected = new Set()

          const mousemove = e => {
            const dx = e.clientX - sx
            const dy = e.clientY - sy
            if (!(Math.abs(dx) > 15 || Math.abs(dy) > 15)) return

            const left = validValue(tbodyRect.left, sx, Math.min(sx, e.clientX))
            const top = validValue(tbodyRect.top, sy, Math.min(sy, e.clientY))
            const width = validValue(0, tbodyRect.right - sx, Math.abs(dx))
            const height = validValue(0, tbodyRect.bottom - sy, Math.abs(dy))
            const width1 = validValue(0, Math.abs(tbodyRect.left - sx), Math.abs(dx))
            const height1 = validValue(0, Math.abs(tbodyRect.top - sy), Math.abs(dy))

            odiv.style.left = `${left}px`
            odiv.style.top = `${top}px`
            odiv.style.width = `${dx > 0 ? width : width1}px`
            odiv.style.height = `${dy > 0 ? height : height1}px`

            const rangeRect = odiv.getBoundingClientRect()

            for (let i = 0, cells = el.querySelectorAll('td'); i < cells.length; i++) {
              const cell = cells[i]

              if (intersects(rangeRect, cell.getBoundingClientRect())) {
                collected.add(cell)
                const rowIndex = cell.getAttribute('data-row-index')
                const columnIndex = cell.getAttribute('data-column-index')

                context.rangeDay(context.rows[rowIndex][columnIndex], rowIndex, columnIndex)
              }
            }

            collected.forEach(cell => {
              if (!intersects(rangeRect, cell.getBoundingClientRect())) {
                collected.delete(cell)
                const rowIndex = cell.getAttribute('data-row-index')
                const columnIndex = cell.getAttribute('data-column-index')

                context.unrangeDay(context.rows[rowIndex][columnIndex], rowIndex, columnIndex)
              }
            })
          }

          const mouseup = _ => {
            context.tooltip.disabled = false

            document.body.style.cursor = 'grab'
            document.body.style.userSelect = 'auto'
            odiv.remove()
            collected.clear()
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
            document.removeEventListener('contextmenu', mouseup)
          }

          document.addEventListener('mousemove', mousemove)
          document.addEventListener('mouseup', mouseup)
          document.addEventListener('contextmenu', mouseup)
        })

        el.addEventListener('mousedown', mousedown)
      },

      unbind(el) {
        const mousedown = el.__bind_mousedown_func
        el.removeEventListener('mousedown', mousedown)
      },
    },

    tooltip: {
      bind(el, _binding, vnode) {
        const { context } = vnode

        const mouseenter = (el.__tbody_enter__ = _ => {
          document.addEventListener('mousemove', mousemoveDelay)
          el.addEventListener('mouseleave', mouseleave)
        })

        const mousemove = e => {
          if (context.tooltip.disabled) return

          if (!context.tooltip.visible) {
            context.tooltip.visible = true
          }

          const { x, y } = e
          const tbody = context.$refs.tbody
          const tooltip = context.$refs.tooltip

          const { left, top, right, bottom } = tbody.getBoundingClientRect()
          const tooltipRect = tooltip.$el.getBoundingClientRect()

          const tx = validValue(left, right, x) - left
          const ty = validValue(top, bottom, y) - top

          const offsetY = bottom - y
          const offsetX = right - x
          const space = 10

          if (offsetY < tooltipRect.height) {
            context.tooltip['py'] = -(tooltipRect.height + space)
          } else {
            context.tooltip['py'] = space
          }

          if (offsetX < tooltipRect.width / 4) {
            context.tooltip['px'] = -(tooltipRect.width + space)
          } else {
            context.tooltip['px'] = space
          }

          context.tooltip['tx'] = tx + space
          context.tooltip['ty'] = ty + space
        }

        const [mousemoveDelay] = doubleHandler(mousemove, 0)

        const mouseleave = _ => {
          context.tooltip.visible = false

          document.removeEventListener('mousemove', mousemoveDelay)
          el.removeEventListener('mouseleave', mouseleave)
        }

        el.addEventListener('mouseenter', mouseenter)
      },

      unbind(el) {
        const mouseenter = el.__tbody_enter__
        el.removeEventListener('mouseenter', mouseenter)
      },
    },
  },

  watch: {
    $props: {
      handler() {
        this.generateDate()
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.highlight-cell {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.05;
  }
}
.highlight-selected {
  background-color: #8b5cf6;
  color: #fff;
}
.el-calendar-table .el-calendar-day:hover {
  background-color: #8b5cf6;
}
.el-calendar-table .el-calendar-day {
  height: 32px;
}
</style>
