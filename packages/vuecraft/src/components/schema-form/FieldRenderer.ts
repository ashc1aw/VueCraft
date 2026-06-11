/**
 * FieldRenderer — Per-field render function component
 *
 * Uses a render function (via `h()`) instead of an SFC template because each
 * field type needs different Element Plus components and child structures
 * (e.g., ElSelect needs ElOption children, ElRadioGroup needs ElRadio children).
 * A switch statement in a render function is more concise than v-if chains.
 */

import {
  defineComponent,
  h,
  Fragment,
  type PropType,
  type VNode,
} from 'vue'
import {
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElSwitch,
  ElDatePicker,
  ElTimePicker,
  ElColorPicker,
  ElRate,
  ElSlider,
} from 'element-plus'
import type { FieldConfig, CustomWidgetsMap, SelectOption } from './types'

/* ═══════════════════ Helper: build common props ═══════════════ */

/**
 * Build the minimal common props shared by all controls.
 * Control-specific defaults (clearable, placeholder, readonly, etc.)
 * are applied per-type in the switch statement below.
 */
function baseProps(
  val: unknown,
  onUpdate: (v: unknown) => void,
  disabled: boolean,
  field: FieldConfig,
  extras?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    modelValue: val,
    'onUpdate:modelValue': onUpdate,
    disabled,
    ...extras,
    ...(field.props ?? {}),
  }
}

/* ═══════════════════ View-mode display helpers ═══════════════ */

/**
 * Look up option label(s) by value from the field's options array.
 * - Single value → single label string
 * - Array value → joined label string
 * Returns the raw value as string if no matching option is found.
 */
function resolveOptionLabel(
  value: unknown,
  options: SelectOption[],
): string {
  if (Array.isArray(value)) {
    const labels = value.map((v) => {
      const opt = options.find((o) => o.value === v)
      return opt?.label ?? String(v)
    })
    return labels.join(', ')
  }
  const opt = options.find((o) => o.value === value)
  return opt?.label ?? String(value ?? '')
}

/**
 * Build a plain-text display VNode for the given field type.
 * Called when `mode === 'view'` — no form controls, just values.
 */
function buildViewDisplay(
  field: FieldConfig,
  val: unknown,
): VNode {
  const strVal = String(val ?? '')

  switch (field.type) {
    /* ── Option-based types — resolve labels ──── */
    case 'select':
      return h('span', { class: 'vc-schema-form__view-value' }, resolveOptionLabel(val, field.options ?? []))

    case 'radio':
      return h('span', { class: 'vc-schema-form__view-value' }, resolveOptionLabel(val, field.options ?? []))

    case 'checkbox':
      return h('span', { class: 'vc-schema-form__view-value' }, resolveOptionLabel(val, field.options ?? []))

    /* ── Color picker — swatch + hex ─────────── */
    case 'color-picker':
      return h('span', { class: 'vc-schema-form__view-value' }, [
        h('span', {
          class: 'vc-schema-form__color-swatch',
          style: { background: strVal || 'transparent' },
        }),
        h('code', strVal || '—'),
      ])

    /* ── All other types — plain text ────────── */
    default:
      return h('span', { class: 'vc-schema-form__view-value' }, val != null && val !== '' ? strVal : '—')
  }
}

/* ═══════════════════ Build control for a field ═══════════════ */

function buildControl(
  field: FieldConfig,
  val: unknown,
  onUpdate: (v: unknown) => void,
  disabled: boolean,
  readonly: boolean,
  customWidgets: CustomWidgetsMap,
): VNode {
  const placeholder = field.placeholder ?? field.label

  switch (field.type) {
    /* ── Text ─────────────────────────────── */
    case 'input':
      return h(ElInput, baseProps(val, onUpdate, disabled, field, {
        clearable: true,
        placeholder,
        readonly,
      }) as Record<string, unknown>)

    case 'textarea':
      return h(ElInput, baseProps(val, onUpdate, disabled, field, {
        type: 'textarea',
        rows: (field.props?.rows as number) ?? 3,
        clearable: true,
        placeholder,
        readonly,
      }) as Record<string, unknown>)

    /* ── Number ───────────────────────────── */
    case 'number':
      return h(ElInputNumber, baseProps(val, onUpdate, disabled, field, {
        controlsPosition: 'right',
        placeholder,
        readonly,
      }) as Record<string, unknown>)

    /* ── Select ───────────────────────────── */
    case 'select':
      return h(
        ElSelect,
        baseProps(val, onUpdate, disabled, field, {
          clearable: true,
          placeholder,
          readonly,
        }) as Record<string, unknown>,
        () =>
          (field.options ?? []).map((opt) =>
            h(ElOption, {
              key: String(opt.value),
              label: opt.label,
              value: opt.value,
              disabled: opt.disabled,
            }),
          ),
      )

    /* ── Radio group ──────────────────────── */
    case 'radio':
      return h(
        ElRadioGroup,
        baseProps(val, onUpdate, disabled, field) as Record<string, unknown>,
        () =>
          (field.options ?? []).map((opt) =>
            h(ElRadio, {
              key: String(opt.value),
              value: opt.value,
              disabled: opt.disabled,
            }, () => opt.label),
          ),
      )

    /* ── Checkbox group ───────────────────── */
    case 'checkbox':
      return h(
        ElCheckboxGroup,
        baseProps(val, onUpdate, disabled, field) as Record<string, unknown>,
        () =>
          (field.options ?? []).map((opt) =>
            h(ElCheckbox, {
              key: String(opt.value),
              value: opt.value,
              disabled: opt.disabled,
            }, () => opt.label),
          ),
      )

    /* ── Switch ───────────────────────────── */
    case 'switch':
      return h(ElSwitch, baseProps(val, onUpdate, disabled, field) as Record<string, unknown>)

    /* ── Date picker ──────────────────────── */
    case 'date-picker':
      return h(ElDatePicker, baseProps(val, onUpdate, disabled, field, {
        type: (field.props?.dateType as string) ?? 'date',
        clearable: true,
        placeholder,
        readonly,
      }) as Record<string, unknown>)

    /* ── Time picker ──────────────────────── */
    case 'time-picker':
      return h(ElTimePicker, baseProps(val, onUpdate, disabled, field, {
        clearable: true,
        placeholder,
        readonly,
      }) as Record<string, unknown>)

    /* ── Color picker ─────────────────────── */
    case 'color-picker':
      return h(ElColorPicker, baseProps(val, onUpdate, disabled, field, {
        readonly,
      }) as Record<string, unknown>)

    /* ── Rate ─────────────────────────────── */
    case 'rate':
      return h(ElRate, baseProps(val, onUpdate, disabled, field) as Record<string, unknown>)

    /* ── Slider ───────────────────────────── */
    case 'slider':
      return h(ElSlider, baseProps(val, onUpdate, disabled, field, {
        showInput: true,
      }) as Record<string, unknown>)

    /* ── Custom widget or fallback ─────────── */
    default: {
      const customFn = customWidgets[field.type]
      if (customFn) {
        return customFn(val, onUpdate, field)
      }
      console.warn(
        `[SchemaForm] Unknown field type: "${String(field.type)}". Falling back to ElInput.`,
      )
      return h(ElInput, baseProps(val, onUpdate, disabled, field, {
        clearable: true,
        placeholder,
      }) as Record<string, unknown>)
    }
  }
}

/* ═══════════════════ Component ══════════════════════════════ */

export default defineComponent({
  name: 'FieldRenderer',

  props: {
    field: { type: Object as PropType<FieldConfig>, required: true },
    // eslint-disable-next-line vue/require-default-prop, vue/require-prop-types
    modelValue: { required: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    mode: { type: String as PropType<'edit' | 'view'>, default: 'edit' },
    customWidgets: {
      type: Object as PropType<CustomWidgetsMap>,
      default: () => ({}),
    },
  },

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    return () => {
      const { field, modelValue: val, disabled, readonly, customWidgets, mode } = props

      const onUpdate = (v: unknown) => {
        emit('update:modelValue', v)
      }

      /* ── Slot override ──────────────────── */
      if (field.slot) {
        const slotFn = slots[field.slot]
        if (slotFn) {
          return h(
            ElFormItem,
            {
              label: field.label,
              prop: field.key,
              rules: field.rules,
            },
            () => slotFn({ value: val, onUpdate, field }),
          )
        }
      }

      /* ── View mode: plain-text display ──── */
      if (mode === 'view') {
        const display = buildViewDisplay(field, val)
        const children: VNode[] = [display]
        if (field.tips) {
          children.push(
            h('div', { class: 'vc-schema-form__tips' }, field.tips),
          )
        }
        return h(
          ElFormItem,
          {
            label: field.label,
            prop: field.key,
          },
          () => h(Fragment, children),
        )
      }

      /* ── Build control ──────────────────── */
      const control = buildControl(field, val, onUpdate, disabled, readonly, customWidgets)

      /* ── Build children array ──────────── */
      const children: VNode[] = [control]
      if (field.tips) {
        children.push(
          h('div', { class: 'vc-schema-form__tips' }, field.tips),
        )
      }

      return h(
        ElFormItem,
        {
          label: field.label,
          prop: field.key,
          rules: field.rules,
        },
        () => h(Fragment, children),
      )
    }
  },
})
