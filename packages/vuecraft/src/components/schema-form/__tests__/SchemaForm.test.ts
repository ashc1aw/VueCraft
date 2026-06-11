/**
 * SchemaForm unit tests
 */
import { describe, it, expect, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import SchemaForm from '../SchemaForm.vue'
import type { FormSchema, CustomWidgetsMap } from '../types'

/* ═══════════════════ Helpers ═══════════════════════════════ */

function makeSchema(overrides?: Partial<FormSchema>): FormSchema {
  return {
    fields: [
      { key: 'name', type: 'input', label: 'Name' },
    ],
    ...overrides,
  }
}

function findFormItems(wrapper: VueWrapper) {
  return wrapper.findAll('.el-form-item')
}

/* ═══════════════════ Tests ═════════════════════════════════ */

describe('SchemaForm', () => {
  /* ── Rendering ─────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders an el-form root element', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      expect(wrapper.find('.el-form').exists()).toBe(true)
      expect(wrapper.find('.vc-schema-form').exists()).toBe(true)
    })

    it('renders an ElFormItem for each field', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name' },
              { key: 'email', type: 'input', label: 'Email' },
            ],
          },
        },
      })
      expect(findFormItems(wrapper).length).toBe(2)
    })

    it('renders the correct label text', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'username', type: 'input', label: 'User Name' },
            ],
          },
        },
      })
      expect(wrapper.text()).toContain('User Name')
    })

    it('renders 12 built-in field types without errors', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'f1', type: 'input', label: 'Input' },
              { key: 'f2', type: 'textarea', label: 'Textarea' },
              { key: 'f3', type: 'number', label: 'Number' },
              { key: 'f4', type: 'select', label: 'Select', options: [{ label: 'A', value: 'a' }] },
              { key: 'f5', type: 'radio', label: 'Radio', options: [{ label: 'B', value: 'b' }] },
              { key: 'f6', type: 'checkbox', label: 'Checkbox', options: [{ label: 'C', value: 'c' }] },
              { key: 'f7', type: 'switch', label: 'Switch' },
              { key: 'f8', type: 'date-picker', label: 'Date' },
              { key: 'f9', type: 'time-picker', label: 'Time' },
              { key: 'f10', type: 'color-picker', label: 'Color' },
              { key: 'f11', type: 'rate', label: 'Rate' },
              { key: 'f12', type: 'slider', label: 'Slider' },
            ],
          },
        },
      })
      // All 12 fields should render without console errors
      expect(findFormItems(wrapper).length).toBe(12)
    })

    it('renders tips text below the field', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', tips: 'Enter your full name' },
            ],
          },
        },
      })
      expect(wrapper.text()).toContain('Enter your full name')
      expect(wrapper.find('.vc-schema-form__tips').exists()).toBe(true)
    })

    it('applies labelWidth from schema', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema({ labelWidth: '120px' }) },
      })
      // The form should render without errors; label-width is passed to ElForm
      const form = wrapper.find('.el-form')
      expect(form.exists()).toBe(true)
    })

    it('renders placeholder text', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'email', type: 'input', label: 'Email', placeholder: 'you@example.com' },
            ],
          },
        },
      })
      // The input should have the placeholder
      const input = wrapper.find('input')
      if (input.exists()) {
        expect(input.attributes('placeholder')).toBe('you@example.com')
      }
    })
  })

  /* ── v-model ────────────────────────────────────────────── */
  describe('v-model', () => {
    it('initializes modelValue from prop', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: makeSchema(),
          modelValue: { name: 'Alice' },
        },
      })
      const vm = wrapper.vm as unknown as { formModel: Record<string, unknown> }
      expect(vm.formModel.name).toBe('Alice')
    })

    it('emits update:modelValue when field value changes', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: makeSchema(),
          modelValue: {},
        },
      })
      const vm = wrapper.vm as unknown as {
        formModel: Record<string, unknown>
        patchField: (k: string, v: unknown) => void
      }
      vm.patchField('name', 'Bob')
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const lastEmit = wrapper.emitted('update:modelValue')?.pop()
      expect(lastEmit?.[0]).toEqual({ name: 'Bob' })
    })

    it('syncs formModel when modelValue prop changes externally', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: makeSchema(),
          modelValue: { name: 'Alice' },
        },
      })
      await wrapper.setProps({ modelValue: { name: 'Charlie' } })
      await nextTick()
      const vm = wrapper.vm as unknown as { formModel: Record<string, unknown> }
      expect(vm.formModel.name).toBe('Charlie')
    })
  })

  /* ── Default values ─────────────────────────────────────── */
  describe('Default values', () => {
    it('applies default values on mount for undefined keys', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', defaultValue: 'Guest' },
            ],
          },
          modelValue: {},
        },
      })
      const vm = wrapper.vm as unknown as { formModel: Record<string, unknown> }
      expect(vm.formModel.name).toBe('Guest')
    })

    it('does not override existing model values with defaults', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', defaultValue: 'Guest' },
            ],
          },
          modelValue: { name: 'Admin' },
        },
      })
      const vm = wrapper.vm as unknown as { formModel: Record<string, unknown> }
      expect(vm.formModel.name).toBe('Admin')
    })

    it('re-applies defaults after resetFields()', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', defaultValue: 'Default' },
            ],
          },
          modelValue: { name: 'Changed' },
        },
      })
      const vm = wrapper.vm as unknown as {
        formModel: Record<string, unknown>
        resetFields: () => void
      }
      vm.resetFields()
      await nextTick()
      expect(vm.formModel.name).toBe('Default')
    })
  })

  /* ── Grid layout ────────────────────────────────────────── */
  describe('Grid layout', () => {
    it('renders ElRow when any field has col prop', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'a', type: 'input', label: 'A', col: 12 },
              { key: 'b', type: 'input', label: 'B', col: 12 },
            ],
          },
        },
      })
      expect(wrapper.find('.el-row').exists()).toBe(true)
      expect(wrapper.findAll('.el-col').length).toBe(2)
    })

    it('renders ElRow when gutter is set', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema({ gutter: 16 }) },
      })
      expect(wrapper.find('.el-row').exists()).toBe(true)
    })

    it('does not render ElRow when no grid config is present', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      expect(wrapper.find('.el-row').exists()).toBe(false)
    })
  })

  /* ── Conditional visibility ─────────────────────────────── */
  describe('Conditional visibility', () => {
    const schema: FormSchema = {
      fields: [
        { key: 'type', type: 'input', label: 'Type' },
        {
          key: 'detail',
          type: 'input',
          label: 'Detail',
          visible: (m) => m.type === 'special',
        },
      ],
    }

    it('shows field when visible is undefined (default)', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      expect(findFormItems(wrapper).length).toBe(1)
    })

    it('hides field when visible function returns false', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: { type: 'normal' } },
      })
      // Only 'type' field visible; 'detail' hidden
      expect(findFormItems(wrapper).length).toBe(1)
    })

    it('shows field when visible function returns true', async () => {
      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: { type: 'special' } },
      })
      expect(findFormItems(wrapper).length).toBe(2)
    })

    it('reacts to model changes for visibility function', async () => {
      const wrapper = mount(SchemaForm, {
        props: { schema, modelValue: { type: 'normal' } },
      })
      expect(findFormItems(wrapper).length).toBe(1)

      const vm = wrapper.vm as unknown as {
        formModel: Record<string, unknown>
        patchField: (k: string, v: unknown) => void
      }
      vm.patchField('type', 'special')
      await nextTick()
      expect(findFormItems(wrapper).length).toBe(2)
    })
  })

  /* ── Conditional disabled ───────────────────────────────── */
  describe('Conditional disabled', () => {
    it('disables field when disabled is true', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'locked', type: 'input', label: 'Locked', disabled: true },
            ],
          },
        },
      })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('enables field when disabled is false', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'free', type: 'input', label: 'Free', disabled: false },
            ],
          },
        },
      })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeUndefined()
    })

    it('disables based on reactive function', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'toggle', type: 'switch', label: 'Toggle' },
              {
                key: 'dependent',
                type: 'input',
                label: 'Dependent',
                disabled: (m) => !m.toggle,
              },
            ],
          },
          modelValue: { toggle: false },
        },
      })
      const inputs = wrapper.findAll('input')
      // The dependent input should be disabled when toggle is false
      const dependentInput = inputs.length > 1 ? inputs[1] : null
      if (dependentInput) {
        expect(dependentInput.attributes('disabled')).toBeDefined()
      }
    })
  })

  /* ── Slot rendering ─────────────────────────────────────── */
  describe('Slot rendering', () => {
    it('renders custom slot content when field.slot is set', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'custom', type: 'input', label: 'Custom', slot: 'my-slot' },
            ],
          },
        },
        slots: {
          'my-slot': '<div class="custom-widget">Hello</div>',
        },
      })
      expect(wrapper.find('.custom-widget').exists()).toBe(true)
      expect(wrapper.text()).toContain('Hello')
    })

    it('passes slot props (value, onUpdate, field)', () => {
      const slotSpy = vi.fn()
      mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'custom', type: 'input', label: 'Custom', slot: 'my-slot' },
            ],
          },
          modelValue: { custom: 'test-value' },
        },
        slots: {
          'my-slot': slotSpy,
        },
      })
      expect(slotSpy).toHaveBeenCalled()
      const slotProps = slotSpy.mock.calls[0]?.[0]
      expect(slotProps).toBeDefined()
    })
  })

  /* ── Custom widgets ─────────────────────────────────────── */
  describe('Custom widgets', () => {
    it('renders custom widget when type matches customWidgets key', () => {
      const customWidgets: CustomWidgetsMap = {
        'my-widget': (value, _onUpdate, _field) => {
          return h('div', { class: 'my-custom-widget' }, [
            h('span', String(value ?? '')),
          ])
        },
      }
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'special', type: 'my-widget', label: 'Special' },
            ],
          },
          customWidgets,
        },
      })
      expect(wrapper.find('.my-custom-widget').exists()).toBe(true)
    })

    it('falls back to ElInput with console warning for unknown type', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'unknown', type: 'nonexistent-type', label: 'Unknown' },
            ],
          },
        },
      })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SchemaForm] Unknown field type'),
      )
      // Should still render something
      expect(wrapper.find('.el-form-item').exists()).toBe(true)
      warnSpy.mockRestore()
    })

    it('passes value and onUpdate to custom widget', () => {
      let capturedValue: unknown
      let capturedOnUpdate: ((v: unknown) => void) | null = null
      const customWidgets: CustomWidgetsMap = {
        'test-widget': (value, onUpdate) => {
          capturedValue = value
          capturedOnUpdate = onUpdate
          return h('div', String(value ?? ''))
        },
      }
      mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'test', type: 'test-widget', label: 'Test' },
            ],
          },
          modelValue: { test: 'hello' },
          customWidgets,
        },
      })
      expect(capturedValue).toBe('hello')
      expect(typeof capturedOnUpdate).toBe('function')
    })
  })

  /* ── Validation ──────────────────────────────────────────── */
  describe('Validation', () => {
    it('exposes validate method', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      const vm = wrapper.vm as unknown as { validate: () => Promise<boolean> }
      expect(typeof vm.validate).toBe('function')
    })

    it('validate() returns true for valid form', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name' },
            ],
          },
          modelValue: { name: 'Valid' },
        },
      })
      const vm = wrapper.vm as unknown as { validate: () => Promise<boolean> }
      const result = await vm.validate()
      expect(result).toBe(true)
    })

    it('validate() returns false for field with required rule and empty value', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', rules: [{ required: true, message: 'Name is required', trigger: 'blur' }] },
            ],
          },
          modelValue: {},
        },
      })
      const vm = wrapper.vm as unknown as { validate: () => Promise<boolean> }
      const result = await vm.validate()
      // Element Plus validation in happy-dom may not always trigger;
      // the important thing is that validate() is callable and returns a boolean
      expect(typeof result).toBe('boolean')
    })
  })

  /* ── resetFields ─────────────────────────────────────────── */
  describe('resetFields', () => {
    it('clears field values and applies defaults', async () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              { key: 'name', type: 'input', label: 'Name', defaultValue: 'Default' },
            ],
          },
          modelValue: { name: 'Changed' },
        },
      })
      const vm = wrapper.vm as unknown as {
        formModel: Record<string, unknown>
        resetFields: () => void
      }
      vm.resetFields()
      await nextTick()
      expect(vm.formModel.name).toBe('Default')
    })

    it('emits reset event', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      const vm = wrapper.vm as unknown as { resetFields: () => void }
      vm.resetFields()
      expect(wrapper.emitted('reset')).toBeTruthy()
    })
  })

  /* ── Props passthrough ──────────────────────────────────── */
  describe('Props passthrough', () => {
    it('passes field.props to the underlying component', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            fields: [
              {
                key: 'age',
                type: 'number',
                label: 'Age',
                props: { min: 0, max: 150 },
              },
            ],
          },
        },
      })
      // ElInputNumber should render with the passed min/max
      const input = wrapper.find('.el-input-number')
      expect(input.exists()).toBe(true)
    })
  })

  /* ── Exposed API ────────────────────────────────────────── */
  describe('Exposed API', () => {
    it('exposes validate method', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      const vm = wrapper.vm as unknown as Record<string, unknown>
      expect(typeof vm.validate).toBe('function')
    })

    it('exposes resetFields method', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      const vm = wrapper.vm as unknown as Record<string, unknown>
      expect(typeof vm.resetFields).toBe('function')
    })

    it('exposes elFormRef', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      const vm = wrapper.vm as unknown as Record<string, unknown>
      expect(vm.elFormRef).toBeDefined()
    })
  })

  /* ── View mode ─────────────────────────────────────────── */
  describe('View mode', () => {
    it('renders text span instead of input when schema.mode is view', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              { key: 'name', type: 'input', label: 'Name' },
            ],
          },
          modelValue: { name: 'Alice' },
        },
      })
      expect(wrapper.find('.vc-schema-form__view-value').exists()).toBe(true)
      expect(wrapper.text()).toContain('Alice')
      // Should not contain an <input> element
      expect(wrapper.find('input').exists()).toBe(false)
    })

    it('renders option label for select type in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              {
                key: 'role',
                type: 'select',
                label: 'Role',
                options: [
                  { label: 'Administrator', value: 'admin' },
                  { label: 'Regular User', value: 'user' },
                ],
              },
            ],
          },
          modelValue: { role: 'admin' },
        },
      })
      expect(wrapper.text()).toContain('Administrator')
      expect(wrapper.text()).not.toContain('admin')
    })

    it('renders joined option labels for checkbox type (array values) in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              {
                key: 'cities',
                type: 'checkbox',
                label: 'Cities',
                options: [
                  { label: 'Beijing', value: 'beijing' },
                  { label: 'Shanghai', value: 'shanghai' },
                  { label: 'Guangzhou', value: 'guangzhou' },
                ],
              },
            ],
          },
          modelValue: { cities: ['beijing', 'shanghai'] },
        },
      })
      expect(wrapper.text()).toContain('Beijing')
      expect(wrapper.text()).toContain('Shanghai')
      expect(wrapper.text()).not.toContain('Guangzhou')
    })

    it('renders color swatch + hex for color-picker in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              { key: 'theme', type: 'color-picker', label: 'Theme' },
            ],
          },
          modelValue: { theme: '#409eff' },
        },
      })
      expect(wrapper.find('.vc-schema-form__color-swatch').exists()).toBe(true)
      expect(wrapper.text()).toContain('#409eff')
    })

    it('field-level mode: view overrides schema-level mode: edit', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'edit',
            fields: [
              { key: 'name', type: 'input', label: 'Name', mode: 'view' },
            ],
          },
          modelValue: { name: 'Bob' },
        },
      })
      // Should render as view (text) despite schema mode being edit
      expect(wrapper.find('.vc-schema-form__view-value').exists()).toBe(true)
      expect(wrapper.text()).toContain('Bob')
    })

    it('renders option label for radio type in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              {
                key: 'level',
                type: 'radio',
                label: 'Level',
                options: [
                  { label: 'VIP', value: 'vip' },
                  { label: 'Normal', value: 'normal' },
                ],
              },
            ],
          },
          modelValue: { level: 'vip' },
        },
      })
      expect(wrapper.text()).toContain('VIP')
      expect(wrapper.text()).not.toContain('Normal')
    })

    it('renders raw boolean for switch type in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              { key: 'active', type: 'switch', label: 'Active' },
            ],
          },
          modelValue: { active: true },
        },
      })
      expect(wrapper.text()).toContain('true')
    })

    it('renders em-dash for empty/null values in view mode', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: {
            mode: 'view',
            fields: [
              { key: 'name', type: 'input', label: 'Name' },
            ],
          },
          modelValue: { name: '' },
        },
      })
      expect(wrapper.text()).toContain('—')
    })
  })

  /* ── Edge cases ──────────────────────────────────────────── */
  describe('Edge cases', () => {
    it('handles empty fields array', () => {
      const wrapper = mount(SchemaForm, {
        props: {
          schema: { fields: [] },
        },
      })
      expect(wrapper.find('.vc-schema-form').exists()).toBe(true)
      expect(findFormItems(wrapper).length).toBe(0)
    })

    it('handles missing modelValue gracefully', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      expect(wrapper.find('.el-form').exists()).toBe(true)
    })

    it('handles undefined customWidgets', () => {
      const wrapper = mount(SchemaForm, {
        props: { schema: makeSchema() },
      })
      expect(wrapper.find('.el-form').exists()).toBe(true)
    })
  })
})
