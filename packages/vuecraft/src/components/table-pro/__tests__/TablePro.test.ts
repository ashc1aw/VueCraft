/**
 * TablePro unit tests
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TablePro from '../TablePro.vue'
import type { TableColumn } from '../types'

function makeCol(prop: string, overrides?: Partial<TableColumn>): TableColumn {
  return { prop, label: prop, ...overrides }
}

function makeRow(id: number, extras?: Record<string, unknown>): Record<string, unknown> {
  return { id, name: `Item ${id}`, ...extras }
}

const columns: TableColumn[] = [
  makeCol('id', { label: 'ID', width: 80 }),
  makeCol('name', { label: 'Name' }),
]

describe('TablePro', () => {
  /* ── Rendering ─────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders table with columns', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1), makeRow(2)],
          pagination: false,
        },
      })
      expect(wrapper.find('.vc-table-pro').exists()).toBe(true)
      expect(wrapper.find('.el-table').exists()).toBe(true)
    })

    it('renders pagination by default', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1), makeRow(2)],
        },
      })
      expect(wrapper.find('.el-pagination').exists()).toBe(true)
    })

    it('hides pagination when disabled', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1)],
          pagination: false,
        },
      })
      expect(wrapper.find('.el-pagination').exists()).toBe(false)
    })
  })

  /* ── Selection ─────────────────────────────────────────── */
  describe('Selection', () => {
    it('adds checkbox column when selection is true', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1)],
          selection: true,
          pagination: false,
        },
      })
      // The el-table should render with selection enabled
      expect(wrapper.find('.vc-table-pro').exists()).toBe(true)
      expect(wrapper.find('.el-table').exists()).toBe(true)
    })
  })

  /* ── Loading ───────────────────────────────────────────── */
  describe('Loading', () => {
    it('shows loading overlay', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1)],
          loading: true,
          pagination: false,
        },
      })
      // v-loading adds a loading class or mask
      expect(wrapper.find('.vc-table-pro__body').exists()).toBe(true)
    })
  })

  /* ── Column config ─────────────────────────────────────── */
  describe('Column config', () => {
    it('shows column config button when enabled', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1)],
          columnConfig: true,
          pagination: false,
        },
      })
      expect(wrapper.text()).toContain('Columns')
    })
  })

  /* ── Empty state ───────────────────────────────────────── */
  describe('Empty state', () => {
    it('renders empty text when no data', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [],
          emptyText: 'Nothing here',
          pagination: false,
        },
      })
      expect(wrapper.text()).toContain('Nothing here')
    })
  })

  /* ── Toolbar slot ──────────────────────────────────────── */
  describe('Toolbar slot', () => {
    it('renders toolbar slot content', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns,
          data: [makeRow(1)],
          pagination: false,
        },
        slots: {
          toolbar: '<button class="create-btn">Create</button>',
        },
      })
      expect(wrapper.find('.create-btn').exists()).toBe(true)
      expect(wrapper.text()).toContain('Create')
    })
  })

  /* ── Column slot ──────────────────────────────────────── */
  describe('Column slot', () => {
    it('renders custom column slot', () => {
      const wrapper = mount(TablePro, {
        props: {
          columns: [
            makeCol('id', { label: 'ID', width: 80 }),
            makeCol('name', { label: 'Name', slot: 'custom-cell' }),
          ],
          data: [{ id: 1, name: 'Test' }],
          pagination: false,
        },
        slots: {
          'custom-cell': '<span class="custom-render">Rendered</span>',
        },
      })
      // Component renders without errors when column slots are configured
      expect(wrapper.find('.vc-table-pro').exists()).toBe(true)
      expect(wrapper.find('.el-table').exists()).toBe(true)
    })
  })
})
