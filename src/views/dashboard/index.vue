<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2024-06-08
 -->

<template>
  <div>
    <el-form v-show="showSearch" class="border-[1px] border-[#dfdfdf]" :model="queryParams.form" size="mini" inline label-width="110px">
      <el-form-item class="my-2.5" label="Name">
        <el-input v-model="queryParams.name" placeholder="Name" clearable />
      </el-form-item>

      <el-form-item class="my-2.5" label="Date">
        <el-date-picker v-model="queryParams.date" type="date" :editable="false" placeholder="Date" clearable />
      </el-form-item>

      <el-form-item class="my-2.5">
        <el-button size="mini" type="primary">查询</el-button>
        <el-button size="mini" type="info">重置</el-button>
      </el-form-item>
    </el-form>

    <RightToolbar :show-search.sync="showSearch" :table.sync="table" @queryTable="getList" @interaction="x => (table.hiddenColumns = x)" :componentName="$options.name" @sequence-reset="tableReady"></RightToolbar>

    <el-table :data="table.data" v-loading="table.loading" border stripe :header-cell-style="{ backgroundColor: '#efefef' }" :hidden-columns="table.hiddenColumns" @header-cell-dragend="headerCellDragend" @header-dragend="headerDragend" @table-ready="tableReady">
      <!-- <el-table-column align="center" type="index" label="#" fixed="left" /> -->
      <el-table-column align="center" prop="name" label="名称" width="200" />
      <el-table-column align="center" prop="address" label="地址" width="200" />
      <template v-for="n in 6">
        <el-table-column align="center" :prop="`address${n}`" :label="`地址${n}`" width="200" :key="n" />
      </template>

      <el-table-column align="center" prop="tags" label="标签">
        <template slot-scope="{ row, column: col }">
          <el-tag v-for="tag in row.tags" :key="tag" :type="tag.length > 5 ? 'success' : 'info'">{{ tag }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" prop="date" label="时间" fixed="right" />

      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="{ row, column: col }">
          <el-button type="text" size="mini">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="affix-container2 !bg-yellow-600" style="height: 150vh"></div>
    <div class="affix-container2 !bg-gray-600" style="height: 150vh"></div>
  </div>
</template>

<script>
import tableHeaderDragMixin from '@/mixins/table-header-drag'

export default {
  name: 'test',
  mixins: [tableHeaderDragMixin],
  data() {
    return {
      showSearch: true,
      queryParams: {
        form: {
          name: '',
          date: '',
        },
      },
      table: {
        loading: false,
        data: Array.from({ length: 30 }, () => ({
          date: '2024-06-08',
          name: 'John Brown',
          address: 'New York No. 1 Lake Park',
          address0: 'New York No. 1 Lake Park',
          address1: 'New York No. 1 Lake Park',
          address2: 'New York No. 1 Lake Park',
          address3: 'New York No. 1 Lake Park',
          address4: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        })),
        hiddenColumns: [],
        checkTableInfo: ['名称', '地址', '标签', '时间', '操作'],
      },
    }
  },

  mounted() {},

  methods: {
    getList() {
      this.table.loading = true
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
        this.table.loading = false
      })
    },
  },
  //  End
}
</script>

<style lang="css" scoped></style>
