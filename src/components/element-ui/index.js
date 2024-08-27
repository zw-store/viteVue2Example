import ElTable from './el-table/index.vue'
import ElTableColumn from './el-table-column'
import ElVolume from './el-volume'
import ElVolumeItem from './el-volume/el-volume-item'

export default Vue => {
  Vue.component(ElTable.name, ElTable)
  Vue.component(ElTableColumn.name, ElTableColumn)
  Vue.component(ElVolume.name, ElVolume)
  Vue.component(ElVolumeItem.name, ElVolumeItem)
}
