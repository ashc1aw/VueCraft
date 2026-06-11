<template>
  <div class="vc-table-pro">
    <!-- Toolbar -->
    <div v-if="$slots.toolbar || columnConfig" class="vc-table-pro__toolbar">
      <div class="vc-table-pro__toolbar-left">
        <slot name="toolbar" />
      </div>
      <div v-if="columnConfig" class="vc-table-pro__toolbar-right">
        <el-popover
          placement="bottom-end"
          :width="200"
          trigger="click"
          popper-class="vc-table-pro__col-config-pop"
        >
          <template #reference>
            <el-button size="small" class="vc-table-pro__col-config-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              {{ columnConfigButtonText }}
            </el-button>
          </template>
          <el-checkbox-group v-model="visibleColumns" class="vc-table-pro__col-config-list">
            <el-checkbox
              v-for="col in configurableColumns"
              :key="col.prop"
              :value="col.prop"
              :label="col.label"
            />
          </el-checkbox-group>
        </el-popover>
      </div>
    </div>

    <!-- Table -->
    <div class="vc-table-pro__body" v-loading="loading">
      <el-table
        ref="tableRef"
        :data="data"
        v-bind="$attrs"
        @selection-change="onSelectionChange"
      >
        <!-- Selection column -->
        <el-table-column
          v-if="selection"
          type="selection"
          width="50"
          fixed="left"
        />

        <!-- Data columns -->
        <template v-for="col in displayColumns" :key="col.prop">
          <el-table-column
            v-if="!col.children"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :sortable="col.sortable"
            :fixed="col.fixed"
            :show-overflow-tooltip="col.showOverflowTooltip"
            :formatter="col.formatter as any"
            :align="col.align"
            :header-align="col.headerAlign"
          >
            <template v-if="col.slot && $slots[col.slot]" #default="scope">
              <slot :name="col.slot" v-bind="scope" />
            </template>
          </el-table-column>

          <!-- Multi-level header -->
          <el-table-column
            v-else
            :key="col.prop"
            :label="col.label"
            :align="col.align"
            :header-align="col.headerAlign"
          >
            <el-table-column
              v-for="child in col.children"
              :key="child.prop"
              :prop="child.prop"
              :label="child.label"
              :width="child.width"
              :min-width="child.minWidth"
              :sortable="child.sortable"
              :show-overflow-tooltip="child.showOverflowTooltip"
              :formatter="child.formatter as any"
              :align="child.align"
              :header-align="child.headerAlign"
            >
              <template v-if="child.slot && $slots[child.slot]" #default="scope">
                <slot :name="child.slot" v-bind="scope" />
              </template>
            </el-table-column>
          </el-table-column>
        </template>

        <!-- Empty slot -->
        <template #empty>
          <slot name="empty">
            <div class="vc-table-pro__empty">
              <p>{{ emptyText }}</p>
            </div>
          </slot>
        </template>
      </el-table>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination"
      class="vc-table-pro__pagination"
    >
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="paginationConfig.pageSizes ?? [10, 20, 50, 100]"
        :total="paginationConfig.total ?? data.length"
        :layout="paginationConfig.layout ?? 'total, sizes, prev, pager, next, jumper'"
        :background="paginationConfig.background ?? true"
        @current-change="onPageChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElPopover,
  ElCheckboxGroup,
  ElCheckbox,
  ElButton,
  vLoading,
} from 'element-plus'
import type { TableColumn, PaginationConfig } from './types'

/* ═══════════════════ Props ══════════════════════════════════ */

const props = withDefaults(
  defineProps<{
    /** Column definitions */
    columns: TableColumn[]
    /** Table data rows */
    data: Record<string, unknown>[]
    /** Loading state */
    loading?: boolean
    /** Pagination config — set false to disable */
    pagination?: PaginationConfig | false
    /** Enable row selection (checkbox column) */
    selection?: boolean
    /** Enable column config popover */
    columnConfig?: boolean
    /** localStorage key for persisting column preferences */
    columnConfigKey?: string
    /** Column config button text (consumer-controlled) */
    columnConfigButtonText?: string
    /** Empty state text (consumer-controlled) */
    emptyText?: string
  }>(),
  {
    loading: false,
    pagination: () => ({ pageSize: 10, pageSizes: [10, 20, 50, 100] }),
    selection: false,
    columnConfig: false,
    columnConfigButtonText: 'Columns',
    emptyText: 'No data',
  },
)

/* ═══════════════════ Emits ══════════════════════════════════ */

const emit = defineEmits<{
  'selection-change': [rows: Record<string, unknown>[]]
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

/* ═══════════════════ Internal state ═════════════════════════ */

const tableRef = ref()
const currentPage = ref(props.pagination ? (props.pagination.currentPage ?? 1) : 1)
const currentPageSize = ref(props.pagination ? (props.pagination.pageSize ?? 10) : 10)

// Column visibility — seeded from localStorage if columnConfigKey is set
const visibleColumns = ref<string[]>(
  props.columns
    .filter((c) => c.defaultVisible !== false && !c.children)
    .map((c) => c.prop),
)

// Load persisted column config
onMounted(() => {
  if (props.columnConfigKey) {
    try {
      const saved = localStorage.getItem(`vc-table-pro__cols__${props.columnConfigKey}`)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          visibleColumns.value = parsed
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
})

// Persist column config changes
watch(visibleColumns, (val) => {
  if (props.columnConfigKey) {
    localStorage.setItem(`vc-table-pro__cols__${props.columnConfigKey}`, JSON.stringify(val))
  }
}, { deep: true })

// Sync pagination state from external prop changes
watch(
  () => {
    const p = props.pagination
    return p === false || p === undefined ? undefined : p.currentPage
  },
  (v) => { if (v !== undefined) currentPage.value = v },
)

watch(
  () => {
    const p = props.pagination
    return p === false || p === undefined ? undefined : p.pageSize
  },
  (v) => { if (v !== undefined) currentPageSize.value = v },
)

/* ═══════════════════ Computed ═══════════════════════════════ */

/** Pagination config from props */
const paginationConfig = computed<PaginationConfig>(() => {
  if (props.pagination === false || props.pagination === undefined) {
    return {} as PaginationConfig
  }
  return props.pagination
})

/** Show pagination if enabled and there is data */
const showPagination = computed(() =>
  props.pagination !== false && props.data.length > 0,
)

/** Columns that can be configured (leaf columns without children) */
const configurableColumns = computed(() =>
  props.columns.filter((c) => !c.children),
)

/** Display columns — filtered by visibility */
const displayColumns = computed(() => {
  if (!props.columnConfig) return props.columns
  return props.columns.filter((c) => {
    if (c.children) return true // Multi-level headers always shown
    return visibleColumns.value.includes(c.prop)
  })
})

/* ═══════════════════ Methods ════════════════════════════════ */

function onSelectionChange(rows: Record<string, unknown>[]) {
  emit('selection-change', rows)
}

function onPageChange(page: number) {
  currentPage.value = page
  emit('page-change', page)
}

function onPageSizeChange(size: number) {
  currentPageSize.value = size
  emit('page-size-change', size)
}

defineExpose({ tableRef })
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────── */
.vc-table-pro {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Toolbar ───────────────────────────────────────── */
.vc-table-pro__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 12px;
}

.vc-table-pro__toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vc-table-pro__toolbar-right {
  display: flex;
  align-items: center;
}

.vc-table-pro__col-config-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606780;
}

/* ── Column config popover ─────────────────────────── */
:deep(.vc-table-pro__col-config-list) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Body / loading ────────────────────────────────── */
.vc-table-pro__body {
  min-height: 120px;
}

/* ── Empty state ───────────────────────────────────── */
.vc-table-pro__empty {
  padding: 32px 0;
  color: #909399;
  font-size: 14px;
}

/* ── Pagination ────────────────────────────────────── */
.vc-table-pro__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
}
</style>
