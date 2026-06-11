<template>
  <div class="vc-search-bar">
    <SchemaForm
      ref="schemaFormRef"
      :schema="searchSchema"
      :model-value="modelValue"
      :custom-widgets="customWidgets"
      @update:model-value="onModelUpdate"
    >
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
    </SchemaForm>

    <div class="vc-search-bar__actions">
      <el-button
        type="primary"
        :size="size"
        class="vc-search-bar__btn"
        @click="handleSearch"
      >
        {{ searchText }}
      </el-button>
      <el-button
        :size="size"
        class="vc-search-bar__btn"
        @click="handleReset"
      >
        {{ resetText }}
      </el-button>
      <slot name="extra" />
      <el-button
        v-if="hasCollapsedFields"
        link
        type="primary"
        :size="size"
        class="vc-search-bar__toggle"
        @click="collapsed = !collapsed"
      >
        {{ collapsed ? expandText : collapseText }}
        <span class="vc-search-bar__toggle-icon">{{ collapsed ? '▾' : '▴' }}</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElButton } from 'element-plus'
import SchemaForm from '../schema-form/SchemaForm.vue'
import type { FormSchema, CustomWidgetsMap } from '../schema-form'
import type { SearchField } from './types'

/* ═══════════════════ Props ══════════════════════════════════ */

const props = withDefaults(
  defineProps<{
    /** Field definitions — reuses SearchField (extends SchemaForm FieldConfig) */
    fields: SearchField[]
    /** v-model search params */
    modelValue?: Record<string, unknown>
    /** Debounce delay in ms (0 = no debounce) */
    debounce?: number
    /** Search button text (consumer-controlled) */
    searchText: string
    /** Reset button text (consumer-controlled) */
    resetText: string
    /** Expand button text when collapsed */
    expandText?: string
    /** Collapse button text when expanded */
    collapseText?: string
    /** Component size */
    size?: 'large' | 'default' | 'small'
    /** Custom widgets passed through to SchemaForm */
    customWidgets?: CustomWidgetsMap
  }>(),
  {
    modelValue: () => ({}),
    debounce: 0,
    expandText: 'More',
    collapseText: 'Collapse',
    size: 'default',
    customWidgets: () => ({}),
  },
)

/* ═══════════════════ Emits ══════════════════════════════════ */

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  search: [value: Record<string, unknown>]
  reset: []
}>()

/* ═══════════════════ Internal state ═════════════════════════ */

const schemaFormRef = ref<InstanceType<typeof SchemaForm>>()
const collapsed = ref(true)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

/* ═══════════════════ Computed ═══════════════════════════════ */

/** Fields tagged with collapsed will be hidden when collapsed state is active */
const hasCollapsedFields = computed(() =>
  props.fields.some((f) => f.collapsed === true),
)

/** Build the internal SchemaForm schema, filtering collapsed fields */
const searchSchema = computed<FormSchema>(() => {
  const visible = props.fields.filter((f) => {
    if (f.collapsed === true && collapsed.value) return false
    return true
  })
  // Use flat inline layout (no col/gutter) so fields size naturally by content,
  // avoiding the label-truncation problem of fixed-ratio grid columns.
  return {
    inline: true,
    size: props.size,
    labelWidth: 'auto',
    fields: visible.map((f) => ({ ...f })),
  }
})

/* ═══════════════════ Methods ════════════════════════════════ */

function onModelUpdate(val: Record<string, unknown>) {
  emit('update:modelValue', { ...val })
  if (props.debounce > 0) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('search', { ...val })
    }, props.debounce)
  }
}

function handleSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('search', { ...props.modelValue })
}

function handleReset() {
  schemaFormRef.value?.resetFields()
  emit('reset')
}
</script>

<style scoped>
/* ── Root: flex wrap — fields and actions flow on the same row ─ */
.vc-search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px 16px;
}

/* ── Make SchemaForm's inner el-form a transparent wrapper ─ */
.vc-search-bar :deep(.vc-schema-form),
.vc-search-bar :deep(.el-form) {
  display: contents;
}

/* ── Each field: fixed width so flex wrap works predictably ─ */
.vc-search-bar :deep(.el-form-item) {
  width: 240px;
  margin-right: 0;
  margin-bottom: 0;
}

.vc-search-bar :deep(.el-form-item__label) {
  white-space: nowrap;
}

/* ── Form control widths (inside fixed-width form-item) ─ */
.vc-search-bar :deep(.el-input),
.vc-search-bar :deep(.el-select) {
  min-width: 0;
  width: 100%;
}

.vc-search-bar :deep(.el-date-editor) {
  min-width: 0;
  width: 100%;
}

/* ── Actions: follow fields, push to end of line ───── */
.vc-search-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.vc-search-bar__btn {
  min-width: 64px;
}

.vc-search-bar__toggle {
  font-size: 13px;
  padding: 0 4px;
}

.vc-search-bar__toggle-icon {
  display: inline-block;
  margin-left: 2px;
  font-size: 10px;
  transition: transform 0.2s;
}

/* ── Responsive breakpoints ────────────────────────── */

/* Mobile: stack vertically */
@media (max-width: 640px) {
  .vc-search-bar {
    flex-direction: column;
    gap: 10px;
  }

  .vc-search-bar :deep(.el-form-item) {
    width: 100%;
  }

  .vc-search-bar__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
