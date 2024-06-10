import ElTable from './el-table/index.vue'
import ElTableColumn from './el-table-column'

export default Vue => {
  Vue.component(ElTable.name, ElTable)
  Vue.component(ElTableColumn.name, ElTableColumn)
}
