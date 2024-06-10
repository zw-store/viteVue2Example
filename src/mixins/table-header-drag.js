import { localstorageGet, localstorageSet } from '@/utils'
import { Key } from '@/components/RightToolbar'

export default {
  activated() {
    this.$refs.table?.doLayout()
  },
  methods: {
    headerCellDragend(columns) {
      const optionName = this.$options.name
      const tableMap = localstorageGet(Key)
      if (!tableMap.dragger) tableMap.dragger = {}
      tableMap.dragger[optionName] = columns
      localstorageSet(Key, tableMap)
    },
    headerDragend(newWidth, _oldWidth, column, _event, columns) {
      const optionName = this.$options.name
      const tableMap = localstorageGet(Key)
      if (!tableMap.dragger) tableMap.dragger = {}
      tableMap.dragger[optionName] = columns

      tableMap.dragger[optionName].forEach(item => {
        if (item.label === column.label) item.width = newWidth
      })
      localstorageSet(Key, tableMap)
    },
    tableReady(table) {
      const optionName = this.$options.name
      const tableMap = localstorageGet(Key)
      if (!tableMap.dragger) tableMap.dragger = {}
      table && (this.__cacheTable__ = table)
      ;(table || this.__cacheTable__).changeExistingSort(tableMap.dragger[optionName])
    },
  },
}
