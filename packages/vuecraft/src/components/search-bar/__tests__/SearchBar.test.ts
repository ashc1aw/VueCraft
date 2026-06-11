/**
 * SearchBar unit tests
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchBar from '../SearchBar.vue'

function makeField(key: string, type = 'input', overrides?: Record<string, unknown>) {
  return { key, type, label: key, ...overrides }
}

describe('SearchBar', () => {
  /* ── Rendering ─────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders search and reset buttons', () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [makeField('keyword')],
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      expect(wrapper.text()).toContain('Search')
      expect(wrapper.text()).toContain('Reset')
    })

    it('renders field labels', () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [
            { key: 'keyword', type: 'input', label: 'Keyword' },
          ],
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      expect(wrapper.text()).toContain('Keyword')
    })

    it('renders collapsible toggle when fields have collapsed flag', () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [
            makeField('keyword'),
            { ...makeField('advanced'), collapsed: true },
          ],
          searchText: 'Search',
          resetText: 'Reset',
          expandText: 'More',
          collapseText: 'Collapse',
        },
      })
      expect(wrapper.text()).toContain('More')
    })
  })

  /* ── Events ────────────────────────────────────────────── */
  describe('Events', () => {
    it('emits search event with model values when search button clicked', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [makeField('keyword')],
          modelValue: { keyword: 'test' },
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      await wrapper.find('.vc-search-bar__btn').trigger('click')
      expect(wrapper.emitted('search')).toBeTruthy()
      const emitted = wrapper.emitted('search')!
      expect(emitted[0]?.[0]).toEqual({ keyword: 'test' })
    })

    it('emits reset event when reset button clicked', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [makeField('keyword')],
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      // Find reset button (second button)
      const buttons = wrapper.findAll('.vc-search-bar__btn')
      await buttons[1]?.trigger('click')
      expect(wrapper.emitted('reset')).toBeTruthy()
    })

    it('emits update:modelValue when form values change', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [makeField('keyword')],
          modelValue: { keyword: '' },
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      // SchemaForm's v-model sync should work
      const vm = wrapper.vm as unknown as {
        onModelUpdate: (v: Record<string, unknown>) => void
      }
      vm.onModelUpdate({ keyword: 'new' })
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  /* ── Debounce ──────────────────────────────────────────── */
  describe('Debounce', () => {
    it('delays search emit when debounce is set', async () => {
      vi.useFakeTimers()
      const wrapper = mount(SearchBar, {
        props: {
          fields: [makeField('keyword')],
          modelValue: { keyword: '' },
          debounce: 300,
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      const vm = wrapper.vm as unknown as {
        onModelUpdate: (v: Record<string, unknown>) => void
      }
      vm.onModelUpdate({ keyword: 'debounced' })
      // Should not emit search immediately
      expect(wrapper.emitted('search')).toBeFalsy()
      vi.advanceTimersByTime(300)
      expect(wrapper.emitted('search')).toBeTruthy()
      vi.useRealTimers()
    })
  })

  /* ── Collapse ──────────────────────────────────────────── */
  describe('Collapse', () => {
    it('hides collapsed fields by default', () => {
      const wrapper = mount(SearchBar, {
        props: {
          fields: [
            makeField('keyword'),
            { ...makeField('advanced'), collapsed: true },
          ],
          searchText: 'Search',
          resetText: 'Reset',
        },
      })
      // The advanced field label should not be visible
      expect(wrapper.text()).not.toContain('advanced')
    })
  })
})
