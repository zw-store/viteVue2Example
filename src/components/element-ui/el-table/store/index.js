import Vue from 'vue'
import Watcher from './watcher'
import { arrayFind } from 'element-ui/src/utils/util'

Watcher.prototype.mutations = {
  setData(states, data) {
    const dataInstanceChanged = states._data !== data
    states._data = data

    this.execQuery()
    // 数据变化，更新部分数据。
    // 没有使用 computed，而是手动更新部分数据 https://github.com/vuejs/vue/issues/6660#issuecomment-331417140
    this.updateCurrentRowData()
    this.updateExpandRows()
    if (states.reserveSelection) {
      this.assertRowKey()
      this.updateSelectionByRowKey()
    } else {
      if (dataInstanceChanged) {
        this.clearSelection()
      } else {
        this.cleanSelection()
      }
    }
    this.updateAllSelected()

    this.updateTableScrollY()
  },

  insertColumn(states, column, index, parent) {
    let array = states._columns
    if (parent) {
      array = parent.children
      if (!array) array = parent.children = []
    }

    if (typeof index !== 'undefined') {
      array.splice(index, 0, column)
    } else {
      array.push(column)
    }

    if (column.type === 'selection') {
      states.selectable = column.selectable
      states.reserveSelection = column.reserveSelection
    }

    if (!column.insertColumnIndex) {
      column.insertColumnIndex = index
    }

    if (this.table.$ready) {
      this.updateColumns() // hack for dynamics insert column
      this.scheduleLayout()
    }
  },

  removeColumn(states, column, parent) {
    let array = states._columns
    if (parent) {
      array = parent.children
      if (!array) array = parent.children = []
    }
    if (array) {
      array.splice(array.indexOf(column), 1)
    }

    if (this.table.$ready) {
      this.updateColumns() // hack for dynamics remove column
      this.scheduleLayout()
    }
  },

  sort(states, options) {
    const { prop, order, init } = options
    if (prop) {
      const column = arrayFind(states.columns, column => column.property === prop)
      if (column) {
        column.order = order
        this.updateSort(column, prop, order)
        this.commit('changeSortCondition', { init })
      }
    }
  },

  changeSortCondition(states, options) {
    // 修复 pr https://github.com/ElemeFE/element/pull/15012 导致的 bug
    const { sortingColumn: column, sortProp: prop, sortOrder: order } = states
    if (order === null) {
      states.sortingColumn = null
      states.sortProp = null
    }
    const ingore = { filter: true }
    this.execQuery(ingore)

    if (!options || !(options.silent || options.init)) {
      this.table.$emit('sort-change', {
        column,
        prop,
        order,
      })
    }

    this.updateTableScrollY()
  },

  filterChange(states, options) {
    const { column, values, silent } = options
    const newFilters = this.updateFilters(column, values)

    this.execQuery()

    if (!silent) {
      this.table.$emit('filter-change', newFilters)
    }

    this.updateTableScrollY()
  },

  toggleAllSelection() {
    this.toggleAllSelection()
  },

  rowSelectedChanged(states, row) {
    this.toggleRowSelection(row)
    this.updateAllSelected()
  },

  setHoverRow(states, row) {
    states.hoverRow = row
  },

  setCurrentRow(states, row) {
    this.updateCurrentRow(row)
  },

  updateColumnsCell(states, cache) {
    if (!Array.isArray(cache)) return

    const { _columns } = states
    _columns.sort((item1, item2) => {
      const aa = cache.findIndex(elem => elem.label === item1.label)
      if (aa === -1) return 1
      const bb = cache.findIndex(elem => elem.label === item2.label)
      return aa - bb
    })

    _columns.forEach(item => {
      const corresponding = cache.find(x => x.label === item.label)
      if (corresponding && corresponding.width && corresponding.width !== item.width) {
        item.width = corresponding.width
        item.realWidth = corresponding.width
      }
    })

    this.scheduleLayout()
    this.updateColumns()
  },
}

Watcher.prototype.commit = function (name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}

Watcher.prototype.updateTableScrollY = function () {
  Vue.nextTick(this.table.updateScrollY)
}

export default Watcher
