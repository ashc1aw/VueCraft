/**
 * TablePro — Enterprise table type definitions
 *
 * Wraps el-table + el-pagination with integrated selection,
 * column configuration, loading state, and toolbar slot.
 * Keeps el-table's column/slot API fully intact.
 */

/** Column definition — mirrors el-table-column props */
export interface TableColumn {
  /** Field name in the data object */
  prop: string
  /** Column header text */
  label: string
  /** Fixed column width */
  width?: string | number
  /** Minimum column width */
  minWidth?: string | number
  /** Enable sorting */
  sortable?: boolean | 'custom'
  /** Fixed column position */
  fixed?: 'left' | 'right'
  /** Show tooltip when content overflows */
  showOverflowTooltip?: boolean
  /** Custom formatter function */
  formatter?: (row: Record<string, unknown>, column: TableColumn, cellValue: unknown) => string
  /** Named slot for custom cell rendering — receives { row, column, $index } */
  slot?: string
  /** Nested columns for multi-level header */
  children?: TableColumn[]
  /** Whether the column is visible by default (for columnConfig mode) */
  defaultVisible?: boolean
  /** Cell text alignment */
  align?: 'left' | 'center' | 'right'
  /** Header text alignment */
  headerAlign?: 'left' | 'center' | 'right'
}

/** Pagination configuration */
export interface PaginationConfig {
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  total?: number
  layout?: string
  background?: boolean
}
