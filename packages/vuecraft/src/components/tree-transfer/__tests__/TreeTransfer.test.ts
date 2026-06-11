/**
 * TreeTransfer unit tests
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TreeTransfer from '../TreeTransfer.vue'
import type { TreeNode } from '../types'

function makeNode(
  id: string,
  label: string,
  children?: TreeNode[],
): TreeNode {
  return { id, label, children }
}

const sampleData: TreeNode[] = [
  makeNode('1', 'Dept A', [
    makeNode('1-1', 'Team A-1'),
    makeNode('1-2', 'Team A-2'),
  ]),
  makeNode('2', 'Dept B', [
    makeNode('2-1', 'Team B-1'),
    makeNode('2-2', 'Team B-2', [
      makeNode('2-2-1', 'Sub B-2-1'),
    ]),
  ]),
]

function mountTreeTransfer(modelValue: string[] = []) {
  return mount(TreeTransfer, {
    props: {
      data: sampleData,
      modelValue,
      leftTitle: 'Available',
      rightTitle: 'Selected',
      leftToRightText: 'Add',
      rightToLeftText: 'Remove',
    },
  })
}

describe('TreeTransfer', () => {
  /* ── Rendering ─────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders left and right panel titles', () => {
      const wrapper = mountTreeTransfer()
      expect(wrapper.text()).toContain('Available')
      expect(wrapper.text()).toContain('Selected')
    })

    it('renders transfer button texts', () => {
      const wrapper = mountTreeTransfer()
      expect(wrapper.text()).toContain('Add')
      expect(wrapper.text()).toContain('Remove')
    })

    it('renders filter inputs when filterable is true', () => {
      const wrapper = mount(TreeTransfer, {
        props: {
          data: sampleData,
          modelValue: [],
          leftTitle: 'Available',
          rightTitle: 'Selected',
          leftToRightText: 'Add',
          rightToLeftText: 'Remove',
          filterable: true,
          filterPlaceholder: 'Search...',
        },
      })
      expect(wrapper.findAll('.vc-tree-transfer__filter').length).toBe(2)
    })

    it('does not render filter inputs when filterable is false', () => {
      const wrapper = mountTreeTransfer()
      expect(wrapper.findAll('.vc-tree-transfer__filter').length).toBe(0)
    })

    it('renders panel count badges', () => {
      const wrapper = mountTreeTransfer()
      const badges = wrapper.findAll('.vc-tree-transfer__panel-count')
      expect(badges.length).toBe(2)
    })
  })

  /* ── Transfer logic ─────────────────────────────────────── */
  describe('Transfer', () => {
    it('adds checked keys to modelValue when transferring right', async () => {
      const wrapper = mountTreeTransfer(['1-1'])
      const vm = wrapper.vm as unknown as {
        leftCheckedKeys: string[]
        rightCheckedKeys: string[]
        transferToRight: () => void
        transferToLeft: () => void
      }

      // Simulate checking nodes in left tree
      vm.leftCheckedKeys = ['2']
      vm.transferToRight()
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')!
      const newValue = emitted[emitted.length - 1]?.[0] as string[]
      // Should include '2' and all its descendants
      expect(newValue).toContain('2')
      expect(newValue).toContain('2-1')
      expect(newValue).toContain('2-2')
      expect(newValue).toContain('2-2-1')
    })

    it('removes checked keys from modelValue when transferring left', async () => {
      const wrapper = mountTreeTransfer(['2', '2-1', '2-2', '2-2-1'])
      const vm = wrapper.vm as unknown as {
        leftCheckedKeys: string[]
        rightCheckedKeys: string[]
        transferToRight: () => void
        transferToLeft: () => void
      }

      vm.rightCheckedKeys = ['2']
      vm.transferToLeft()
      await nextTick()

      const emitted = wrapper.emitted('update:modelValue')!
      const newValue = emitted[emitted.length - 1]?.[0] as string[]
      expect(newValue).not.toContain('2')
      expect(newValue).not.toContain('2-1')
      expect(newValue).not.toContain('2-2')
      expect(newValue).not.toContain('2-2-1')
    })

    it('emits change event with direction on transfer', async () => {
      const wrapper = mountTreeTransfer(['1'])
      const vm = wrapper.vm as unknown as {
        leftCheckedKeys: string[]
        rightCheckedKeys: string[]
        transferToRight: () => void
        transferToLeft: () => void
      }

      vm.leftCheckedKeys = ['2']
      vm.transferToRight()
      await nextTick()

      const changeEmitted = wrapper.emitted('change')
      expect(changeEmitted).toBeTruthy()
      const args = changeEmitted![0]!
      expect(args[2]).toBe('right') // direction
    })

    it('emits change event with direction on transfer left', async () => {
      const wrapper = mountTreeTransfer(['2', '2-1', '2-2', '2-2-1'])
      const vm = wrapper.vm as unknown as {
        leftCheckedKeys: string[]
        rightCheckedKeys: string[]
        transferToRight: () => void
        transferToLeft: () => void
      }

      vm.rightCheckedKeys = ['2']
      vm.transferToLeft()
      await nextTick()

      const changeEmitted = wrapper.emitted('change')
      expect(changeEmitted).toBeTruthy()
      const args = changeEmitted![0]!
      expect(args[2]).toBe('left')
    })
  })

  /* ── Disabled state ─────────────────────────────────────── */
  describe('Disabled', () => {
    it('disables transfer buttons when no nodes are checked', () => {
      const wrapper = mountTreeTransfer()
      const buttons = wrapper.findAll('.vc-tree-transfer__btn')
      // Both buttons should be disabled (no checked keys)
      const addBtn = buttons[0]
      const removeBtn = buttons[1]
      expect(addBtn?.attributes('disabled')).toBeDefined()
      expect(removeBtn?.attributes('disabled')).toBeDefined()
    })

    it('disables all interactive elements when disabled prop is true', () => {
      const wrapper = mount(TreeTransfer, {
        props: {
          data: sampleData,
          modelValue: [],
          leftTitle: 'Available',
          rightTitle: 'Selected',
          leftToRightText: 'Add',
          rightToLeftText: 'Remove',
          disabled: true,
        },
      })
      const buttons = wrapper.findAll('.vc-tree-transfer__btn')
      expect(buttons[0]?.attributes('disabled')).toBeDefined()
      expect(buttons[1]?.attributes('disabled')).toBeDefined()
    })
  })

  /* ── Slots ──────────────────────────────────────────────── */
  describe('Slots', () => {
    it('renders left-footer slot content', () => {
      const wrapper = mount(TreeTransfer, {
        props: {
          data: sampleData,
          modelValue: [],
          leftTitle: 'Available',
          rightTitle: 'Selected',
          leftToRightText: 'Add',
          rightToLeftText: 'Remove',
        },
        slots: {
          'left-footer': '<div class="custom-left-footer">Custom Left Footer</div>',
        },
      })
      expect(wrapper.find('.custom-left-footer').exists()).toBe(true)
    })

    it('renders right-footer slot content', () => {
      const wrapper = mount(TreeTransfer, {
        props: {
          data: sampleData,
          modelValue: [],
          leftTitle: 'Available',
          rightTitle: 'Selected',
          leftToRightText: 'Add',
          rightToLeftText: 'Remove',
        },
        slots: {
          'right-footer': '<div class="custom-right-footer">Custom Right Footer</div>',
        },
      })
      expect(wrapper.find('.custom-right-footer').exists()).toBe(true)
    })
  })
})
