/**
 * SchemaForm — Dynamic form type definitions
 *
 * Design goal: describe forms with JSON, eliminate repetitive template code.
 * Each field only needs `key + type + label` to work. All other properties
 * are optional — override only when needed.
 */

import type { FormItemRule } from 'element-plus'
import type { VNode } from 'vue'

/* ═══════════════════ Built-in field types ═══════════════════ */

/**
 * Field types supported out of the box.
 * Each maps to a corresponding Element Plus component.
 */
export type BuiltInFieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date-picker'
  | 'time-picker'
  | 'color-picker'
  | 'rate'
  | 'slider'

/**
 * Field type — built-in types or a custom string key
 * for user-registered widgets via `customWidgets`.
 */
export type FieldType = BuiltInFieldType | string

/* ═══════════════════ Option type ════════════════════════════ */

/** Option item for select / radio / checkbox fields */
export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

/* ═══════════════════ Field config ═══════════════════════════ */

/**
 * Configuration for a single form field.
 *
 * Minimal usage:
 * ```
 * { key: 'name', type: 'input', label: 'Name' }
 * ```
 */
export interface FieldConfig {
  /** Field key — maps to the model property and serves as validation prop */
  key: string
  /** Control type — built-in or custom widget name registered in customWidgets */
  type: FieldType
  /** Label text displayed above or beside the field */
  label: string
  /** Placeholder text shown inside the control when empty */
  placeholder?: string
  /**
   * Default value applied on mount if the model key is undefined.
   * Ignored if the key already has a value in the model.
   */
  defaultValue?: unknown
  /** Options for select / radio / checkbox types */
  options?: SelectOption[]
  /**
   * Validation rules — passed directly to ElFormItem.
   * Supports all Element Plus rule types: required, type, min, max,
   * pattern, validator, trigger, message, etc.
   */
  rules?: FormItemRule[]
  /**
   * Props passed through to the underlying Element Plus component.
   * Useful for component-specific options like `{ min: 0, step: 0.01 }`
   * on ElInputNumber.
   */
  props?: Record<string, unknown>
  /**
   * Grid column span (1–24). Maps to ElCol `span`.
   * Omit for full-width fields.
   */
  col?: number
  /**
   * Conditional visibility.
   * - `boolean`: static — field is always shown/hidden
   * - `(model) => boolean`: reactive — re-evaluated whenever the form model changes
   */
  visible?: boolean | ((model: Record<string, unknown>) => boolean)
  /**
   * Conditional disabled state.
   * - `boolean`: static
   * - `(model) => boolean`: reactive — re-evaluated on every render
   */
  disabled?: boolean | ((model: Record<string, unknown>) => boolean)
  /**
   * Conditional readonly state (makes the control read-only but keeps it
   * interactive for selection/copy). Only applies to text-based controls
   * (input, textarea, number, select, date-picker, time-picker, color-picker).
   * - `boolean`: static
   * - `(model) => boolean`: reactive — re-evaluated on every render
   */
  readonly?: boolean | ((model: Record<string, unknown>) => boolean)
  /**
   * Callback invoked when the field value changes.
   * Receives the new value and the full form model for convenience.
   */
  onChange?: (value: unknown, model: Record<string, unknown>) => void
  /** Help text displayed below the field */
  tips?: string
  /**
   * Custom slot name — when set, fully delegates rendering to the
   * named slot on SchemaForm. Slot receives `{ value, onUpdate, field }`.
   */
  slot?: string
  /**
   * Render mode — `edit` (default) renders form controls,
   * `view` renders plain text display values.
   * Per-field override of the schema-level mode.
   */
  mode?: 'edit' | 'view'
}

/* ═══════════════════ Form schema ════════════════════════════ */

/**
 * Complete form schema — defines the entire form structure.
 *
 * Example:
 * ```
 * const schema: FormSchema = {
 *   fields: [
 *     { key: 'name', type: 'input', label: 'Name' },
 *     { key: 'age', type: 'number', label: 'Age' },
 *   ],
 *   labelWidth: '100px',
 * }
 * ```
 */
export interface FormSchema {
  /** Field definitions */
  fields: FieldConfig[]
  /** Label width — CSS value, e.g. "120px" or "8em" */
  labelWidth?: string
  /** Label position relative to the control */
  labelPosition?: 'left' | 'right' | 'top'
  /** Global component size for all fields */
  size?: 'large' | 'default' | 'small'
  /** Grid gutter in pixels — activates grid layout when set */
  gutter?: number
  /** Whether to render in inline mode (ElForm inline) */
  inline?: boolean
  /**
   * Whether to disable all fields in the form.
   * When true, overrides all individual field disabled settings.
   */
  disabled?: boolean
  /**
   * Form render mode — `edit` (default) renders controls,
   * `view` renders plain text values. Can be overridden per-field.
   */
  mode?: 'edit' | 'view'
}

/* ═══════════════════ Custom widget types ════════════════════ */

/**
 * Custom widget render function.
 *
 * Receives the current value, an update callback, and the full field config.
 * Must return a VNode — typically an Element Plus form control or
 * a custom Vue component rendered via `h()`.
 *
 * Example:
 * ```
 * const myWidget: CustomWidgetRender = (value, onUpdate, field) => {
 *   return h(MyEditor, {
 *     modelValue: value,
 *     'onUpdate:modelValue': onUpdate,
 *     placeholder: field.placeholder,
 *   })
 * }
 * ```
 */
export type CustomWidgetRender = (
  value: unknown,
  onUpdate: (value: unknown) => void,
  field: FieldConfig,
) => VNode

/**
 * Registry mapping custom type keys to their render functions.
 *
 * Pass this to SchemaForm's `customWidgets` prop. When a field's `type`
 * doesn't match any built-in type, the renderer looks up the key here.
 *
 * Example:
 * ```
 * const widgets: CustomWidgetsMap = {
 *   'rich-text': (v, onUpdate, f) => h(MyEditor, { ... }),
 *   'file-upload': (v, onUpdate, f) => h(ElUpload, { ... }),
 * }
 * ```
 */
export type CustomWidgetsMap = Record<string, CustomWidgetRender>
