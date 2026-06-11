<template>
  <el-form
    ref="elFormRef"
    class="vc-schema-form"
    :model="formModel"
    :label-width="schema.labelWidth ?? '100px'"
    :label-position="schema.labelPosition"
    :size="schema.size"
    :inline="schema.inline"
    @submit.prevent="$emit('submit')"
  >
    <!-- Grid layout: when any field has col or schema.gutter is set -->
    <el-row v-if="useGrid" :gutter="schema.gutter ?? 16">
      <el-col
        v-for="field in visibleFields"
        :key="field.key"
        :span="field.col ?? 24"
      >
        <FieldRenderer
          :field="field"
          :model-value="formModel[field.key]"
          :disabled="resolveDisabled(field)"
          :readonly="resolveReadonly(field)"
          :mode="field.mode ?? schema.mode ?? 'edit'"
          :custom-widgets="customWidgets"
          @update:model-value="(v) => patchField(field.key, v)"
        >
          <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
            <slot :name="slotName" v-bind="(scope as { value: unknown; onUpdate: (v: unknown) => void; field: FieldConfig })" />
          </template>
        </FieldRenderer>
      </el-col>
    </el-row>

    <!-- Flat layout: fields stacked vertically -->
    <template v-else>
      <FieldRenderer
        v-for="field in visibleFields"
        :key="field.key"
        :field="field"
        :model-value="formModel[field.key]"
        :disabled="resolveDisabled(field)"
        :readonly="resolveReadonly(field)"
        :mode="field.mode ?? schema.mode ?? 'edit'"
        :custom-widgets="customWidgets"
        @update:model-value="(v) => patchField(field.key, v)"
      >
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
          <slot :name="slotName" v-bind="(scope as { value: unknown; onUpdate: (v: unknown) => void; field: FieldConfig })" />
        </template>
      </FieldRenderer>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElForm, ElRow, ElCol } from 'element-plus'
import type { FormInstance } from 'element-plus'
import FieldRenderer from './FieldRenderer'
import type { FieldConfig, FormSchema, CustomWidgetsMap } from './types'

/* ═══════════════════ Props ══════════════════════════════════ */

const props = withDefaults(
  defineProps<{
    schema: FormSchema
    modelValue?: Record<string, unknown>
    customWidgets?: CustomWidgetsMap
  }>(),
  {
    modelValue: () => ({}),
    customWidgets: () => ({}),
  },
)

/* ═══════════════════ Emits ══════════════════════════════════ */

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  submit: []
  reset: []
}>()

/* ═══════════════════ Internal state ═════════════════════════ */

const elFormRef = ref<FormInstance>()
const formModel = ref<Record<string, unknown>>({ ...props.modelValue })

/** Gate flag to prevent circular update between prop sync and model change */
let syncingFromProp = false

/* ═══════════════════ Watchers ═══════════════════════════════ */

/** Sync external modelValue changes into internal formModel */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    syncingFromProp = true
    formModel.value = { ...val }
    // Defer gate reset so the next micro-task sees the fresh state
    Promise.resolve().then(() => {
      syncingFromProp = false
    })
  },
  { deep: true },
)

/** Sync internal formModel changes back to parent */
watch(
  formModel,
  (val) => {
    if (syncingFromProp) return
    emit('update:modelValue', { ...val })
  },
  { deep: true },
)

/** Apply default values on schema change / mount */
watch(
  () => props.schema.fields,
  (fields) => {
    for (const field of fields) {
      if (field.defaultValue !== undefined && formModel.value[field.key] === undefined) {
        formModel.value[field.key] = field.defaultValue
      }
    }
  },
  { immediate: true },
)

/* ═══════════════════ Computed ═══════════════════════════════ */

/** Visible fields after filtering by `visible` condition */
const visibleFields = computed<FieldConfig[]>(() => {
  return props.schema.fields.filter((field) => {
    if (field.visible === undefined) return true
    if (typeof field.visible === 'function') return field.visible(formModel.value)
    return field.visible
  })
})

/** Whether to use grid layout (ElRow + ElCol) */
const useGrid = computed<boolean>(() => {
  return visibleFields.value.some((f) => f.col != null) || (props.schema.gutter ?? 0) > 0
})

/* ═══════════════════ Methods ════════════════════════════════ */

/** Resolve conditional disabled state for a field (form-level disabled overrides all) */
function resolveDisabled(field: FieldConfig): boolean {
  if (props.schema.disabled) return true
  if (field.disabled === undefined) return false
  if (typeof field.disabled === 'function') return field.disabled(formModel.value)
  return field.disabled
}

/** Resolve conditional readonly state for a field */
function resolveReadonly(field: FieldConfig): boolean {
  if (field.readonly === undefined) return false
  if (typeof field.readonly === 'function') return field.readonly(formModel.value)
  return field.readonly
}

/** Patch a single field value into the model and fire onChange callback */
function patchField(key: string, value: unknown): void {
  formModel.value[key] = value
  // Invoke per-field onChange callback if defined
  const field = props.schema.fields.find(f => f.key === key)
  field?.onChange?.(value, formModel.value)
}

/* ═══════════════════ Exposed API ════════════════════════════ */

defineExpose({
  /** Validate all fields. Returns a Promise resolving to true on success. */
  async validate(): Promise<boolean> {
    if (!elFormRef.value) return true
    try {
      await elFormRef.value.validate()
      return true
    } catch {
      return false
    }
  },

  /** Reset all fields, re-apply defaults, and clear validation state */
  resetFields(): void {
    elFormRef.value?.resetFields()
    // Re-apply defaults
    for (const field of props.schema.fields) {
      if (field.defaultValue !== undefined) {
        formModel.value[field.key] = field.defaultValue
      }
    }
    emit('reset')
  },

  /** Raw ElForm instance for advanced use cases */
  elFormRef,
})
</script>

<style scoped>
/* ── Tips / help text ──────────────────────────────────── */
:deep(.vc-schema-form__tips) {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

/* ── View mode display ─────────────────────────────────── */
:deep(.vc-schema-form__view-value) {
  font-size: 14px;
  color: #1a1a2e;
  line-height: 32px;
}

:deep(.vc-schema-form__color-swatch) {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  vertical-align: middle;
  margin-right: 6px;
  border: 1px solid #ebedf0;
}

:deep(.vc-schema-form__view-value code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  background: #f5f6f8;
  color: #409eff;
  padding: 2px 7px;
  border-radius: 4px;
}
</style>
