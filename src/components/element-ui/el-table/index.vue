<!--
 * Copyright ©
 * #
 * @author: zw
 * @date: 2023-06-12
 -->

<template>
  <div
    class="el-table"
    :class="[
      {
        'el-table--fit': fit,
        'el-table--striped': stripe,
        'el-table--border': border || isGroup,
        'el-table--hidden': isHidden,
        'el-table--group': isGroup,
        'el-table--fluid-height': maxHeight,
        'el-table--scrollable-x': layout.scrollX,
        'el-table--scrollable-y': layout.scrollY,
        'el-table--enable-row-hover': !store.states.isComplex,
        'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100,
      },
      tableSize ? `el-table--${tableSize}` : '',
    ]"
    @mouseleave="handleMouseLeave($event)"
  >
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <affix :container="$el" :disabled="disabledAffix">
      <div v-if="showHeader" v-mousewheel="handleHeaderFooterMousewheel" class="el-table__header-wrapper" ref="headerWrapper">
        <TableHeader
          ref="tableHeader"
          :store="store"
          :border="border"
          :default-sort="defaultSort"
          :style="{
            width: layout.bodyWidth ? layout.bodyWidth + 'px' : '',
          }"
        >
        </TableHeader>
      </div>
    </affix>

    <div class="el-table__body-wrapper" ref="bodyWrapper" :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']" :style="[bodyHeight]">
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
          width: bodyWidth,
        }"
      >
      </table-body>
      <div v-if="!data || data.length === 0" class="el-table__empty-block" ref="emptyBlock" :style="emptyBlockStyle">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div v-if="$slots.append" class="el-table__append-wrapper" ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div v-if="showSummary" v-show="data && data.length > 0" v-mousewheel="handleHeaderFooterMousewheel" class="el-table__footer-wrapper" ref="footerWrapper">
      <table-footer
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : '',
        }"
      >
      </table-footer>
    </div>
    <div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed"
      ref="fixedWrapper"
      :style="[
        {
          width: layout.fixedWidth ? layout.fixedWidth + 'px' : '',
        },
        fixedHeight,
      ]"
    >
      <affix :container="$el" :disabled="disabledAffix">
        <div v-if="showHeader" class="el-table__fixed-header-wrapper" style="position: unset; overflow: hidden" ref="fixedHeaderWrapper">
          <table-header
            ref="fixedTableHeader"
            fixed="left"
            :border="border"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
          ></table-header>
        </div>
      </affix>
      <div
        class="el-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[
          {
            top: layout.headerHeight + 'px',
          },
          fixedBodyHeight,
        ]"
      >
        <table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth,
          }"
        >
        </table-body>
        <div v-if="$slots.append" class="el-table__append-gutter" :style="{ height: layout.appendHeight + 'px' }"></div>
      </div>
      <div v-if="showSummary" v-show="data && data.length > 0" class="el-table__fixed-footer-wrapper" ref="fixedFooterWrapper">
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        ></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed-right"
      ref="rightFixedWrapper"
      :style="[
        {
          width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
          right: layout.scrollY ? (border ? layout.gutterWidth : layout.gutterWidth || 0) + 'px' : '',
        },
        fixedHeight,
      ]"
    >
      <affix :container="$el" :disabled="disabledAffix">
        <div v-if="showHeader" class="el-table__fixed-header-wrapper" style="pointer-events: none; overflow: auto" ref="rightFixedHeaderWrapper">
          <table-header
            ref="rightFixedTableHeader"
            fixed="right"
            :border="border"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
          ></table-header>
        </div>
      </affix>
      <div
        class="el-table__fixed-body-wrapper"
        ref="rightFixedBodyWrapper"
        :style="[
          {
            top: layout.headerHeight + 'px',
          },
          fixedBodyHeight,
        ]"
      >
        <table-body
          fixed="right"
          :store="store"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth,
          }"
        >
        </table-body>
        <div v-if="$slots.append" class="el-table__append-gutter" :style="{ height: layout.appendHeight + 'px' }"></div>
      </div>
      <div v-if="showSummary" v-show="data && data.length > 0" class="el-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper">
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        ></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      class="el-table__fixed-right-patch"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight + 'px',
      }"
    ></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script>
import Table from './table.vue'
import affix from './affix.vue'

export default {
  name: 'ElTable',
  extends: Table,
  components: { affix },
  props: {
    data: { type: Array, default: () => [] },
    size: String,
    width: { type: [String, Number], default: '100%' },
    height: [String, Number],
    maxHeight: [String, Number],
    fit: { type: Boolean, default: true },
    stripe: { type: Boolean, default: true }, // 修改默认值
    border: Boolean,
    rowKey: [String, Function],
    context: {},
    showHeader: { type: Boolean, default: true },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: { type: Boolean, default: true }, // 修改默认值
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    spanMethod: Function,
    selectOnIndeterminate: { type: Boolean, default: true },
    indent: { type: Number, default: 16 },
    treeProps: {
      type: Object,
      default: () => ({ hasChildren: 'hasChildren', children: 'children' }),
    },
    lazy: Boolean,
    load: Function,
    disabledAffix: Boolean,
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__fixed-right .is-hidden {
  visibility: hidden;
  pointer-events: none;
}
</style>
