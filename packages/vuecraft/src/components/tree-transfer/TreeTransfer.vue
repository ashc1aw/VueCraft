<template>
  <div class="vc-tree-transfer">
    <!-- ═══════ Left Panel ═══════ -->
    <div class="vc-tree-transfer__panel">
      <div class="vc-tree-transfer__panel-header">
        <span class="vc-tree-transfer__panel-title">{{ leftTitle }}</span>
        <span class="vc-tree-transfer__panel-count">{{ leftTreeData.length }}</span>
      </div>
      <el-input
        v-if="filterable"
        v-model="leftFilter"
        :placeholder="filterPlaceholder"
        size="small"
        class="vc-tree-transfer__filter"
        clearable
        :disabled="disabled"
      />
      <div class="vc-tree-transfer__panel-body">
        <el-tree
          ref="leftTreeRef"
          :data="leftTreeData"
          :node-key="nodeKey"
          :props="treeProps"
          :filter-node-method="filterNodeMethod"
          :disabled="disabled"
          show-checkbox
          default-expand-all
          @check="onLeftCheck"
        />
      </div>
      <div v-if="$slots['left-footer']" class="vc-tree-transfer__panel-footer">
        <slot name="left-footer" />
      </div>
    </div>

    <!-- ═══════ Action Buttons ═══════ -->
    <div class="vc-tree-transfer__actions">
      <el-button
        :disabled="disabled || leftCheckedKeys.length === 0"
        :size="size"
        class="vc-tree-transfer__btn"
        @click="transferToRight"
      >
        <span class="vc-tree-transfer__btn-icon">→</span>
        <span>{{ leftToRightText }}</span>
      </el-button>
      <el-button
        :disabled="disabled || rightCheckedKeys.length === 0"
        :size="size"
        class="vc-tree-transfer__btn"
        @click="transferToLeft"
      >
        <span class="vc-tree-transfer__btn-icon">←</span>
        <span>{{ rightToLeftText }}</span>
      </el-button>
    </div>

    <!-- ═══════ Right Panel ═══════ -->
    <div class="vc-tree-transfer__panel">
      <div class="vc-tree-transfer__panel-header">
        <span class="vc-tree-transfer__panel-title">{{ rightTitle }}</span>
        <span class="vc-tree-transfer__panel-count">{{ rightTreeData.length }}</span>
      </div>
      <el-input
        v-if="filterable"
        v-model="rightFilter"
        :placeholder="filterPlaceholder"
        size="small"
        class="vc-tree-transfer__filter"
        clearable
        :disabled="disabled"
      />
      <div class="vc-tree-transfer__panel-body">
        <el-tree
          ref="rightTreeRef"
          :data="rightTreeData"
          :node-key="nodeKey"
          :props="treeProps"
          :filter-node-method="filterNodeMethod"
          :disabled="disabled"
          show-checkbox
          default-expand-all
          @check="onRightCheck"
        />
      </div>
      <div v-if="$slots['right-footer']" class="vc-tree-transfer__panel-footer">
        <slot name="right-footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElTree, ElInput, ElButton } from 'element-plus'
import type { TreeNode } from './types'

/* ═══════════════════ Props ══════════════════════════════════ */

const props = withDefaults(
  defineProps<{
    /** Full tree data source */
    data: TreeNode[]
    /** Selected node keys (v-model) */
    modelValue?: string[]
    /** Left panel header text (consumer-controlled) */
    leftTitle: string
    /** Right panel header text (consumer-controlled) */
    rightTitle: string
    /** Transfer-to-right button text (consumer-controlled) */
    leftToRightText: string
    /** Transfer-to-left button text (consumer-controlled) */
    rightToLeftText: string
    /** Enable filter inputs above each tree */
    filterable?: boolean
    /** Filter input placeholder text */
    filterPlaceholder?: string
    /** Unique key field name in tree nodes */
    nodeKey?: string
    /** Display label field name in tree nodes */
    labelKey?: string
    /** Children field name in tree nodes */
    childrenKey?: string
    /** Disable entire component */
    disabled?: boolean
    /** Component size */
    size?: 'default' | 'small'
  }>(),
  {
    modelValue: () => [],
    filterable: false,
    filterPlaceholder: '',
    nodeKey: 'id',
    labelKey: 'label',
    childrenKey: 'children',
    disabled: false,
    size: 'default',
  },
)

/* ═══════════════════ Emits ══════════════════════════════════ */

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [
    leftKeys: string[],
    rightKeys: string[],
    direction: 'left' | 'right',
    movedKeys: string[],
  ]
}>()

/* ═══════════════════ Internal state ═════════════════════════ */

const leftTreeRef = ref<InstanceType<typeof ElTree>>()
const rightTreeRef = ref<InstanceType<typeof ElTree>>()
const leftFilter = ref('')
const rightFilter = ref('')
const leftCheckedKeys = ref<string[]>([])
const rightCheckedKeys = ref<string[]>([])

/* ═══════════════════ Computed ═══════════════════════════════ */

const selectedKeySet = computed<Set<string>>(() => new Set(props.modelValue))

const treeProps = computed(() => ({
  children: props.childrenKey,
  label: props.labelKey,
  disabled: 'disabled',
}))

/**
 * Filter method for el-tree's filter-node-method prop.
 * Matches case-insensitively against the node label.
 */
function filterNodeMethod(value: string, data: Record<string, unknown>): boolean {
  const label = String(data[props.labelKey] ?? '').toLowerCase()
  return label.includes(value.toLowerCase())
}

/* ═══════════════════ Tree filtering utilities ═══════════════ */

/**
 * Recursively collect all descendant keys under a given node.
 */
function collectDescendantKeys(node: TreeNode): string[] {
  const keys: string[] = []
  const children = node[props.childrenKey] as TreeNode[] | undefined
  if (Array.isArray(children)) {
    for (const child of children) {
      keys.push(String(child[props.nodeKey]))
      keys.push(...collectDescendantKeys(child))
    }
  }
  return keys
}

/**
 * Find a node in the tree by key. Returns null if not found.
 */
function findNode(tree: TreeNode[], key: string): TreeNode | null {
  for (const node of tree) {
    if (String(node[props.nodeKey]) === key) return node
    const children = node[props.childrenKey] as TreeNode[] | undefined
    if (Array.isArray(children)) {
      const found = findNode(children, key)
      if (found) return found
    }
  }
  return null
}

/**
 * Filter tree: if `include` is true, keep only nodes whose key is in the set.
 * If `include` is false, remove nodes whose key is in the set.
 * Preserves tree structure for matching children.
 */
function filterTree(tree: TreeNode[], keySet: Set<string>, include: boolean): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of tree) {
    const nodeKey = String(node[props.nodeKey])
    const inSet = keySet.has(nodeKey)

    if (include && !inSet) continue
    if (!include && inSet) continue

    const copy: Record<string, unknown> = JSON.parse(JSON.stringify(node))
    const children = node[props.childrenKey] as TreeNode[] | undefined
    if (Array.isArray(children) && children.length > 0) {
      const filtered = filterTree(children, keySet, include)
      copy[props.childrenKey] = filtered.length > 0 ? filtered : undefined
    }
    result.push(copy)
  }
  return result
}

/** Left tree shows nodes NOT in the selected set */
const leftTreeData = computed<TreeNode[]>(() =>
  filterTree(props.data, selectedKeySet.value, false),
)

/** Right tree shows nodes IN the selected set */
const rightTreeData = computed<TreeNode[]>(() =>
  filterTree(props.data, selectedKeySet.value, true),
)

/* ═══════════════════ Watchers ═══════════════════════════════ */

/** Sync filter text to el-tree's filter method */
watch(leftFilter, (val) => {
  ;(leftTreeRef.value as unknown as { filter: (v: string) => void })?.filter(val)
})

watch(rightFilter, (val) => {
  ;(rightTreeRef.value as unknown as { filter: (v: string) => void })?.filter(val)
})

/* ═══════════════════ Methods ════════════════════════════════ */

/** Handle check events on left tree */
function onLeftCheck(_node: unknown, checkedInfo: { checkedKeys: (string | number)[] }) {
  leftCheckedKeys.value = checkedInfo.checkedKeys.map(String)
}

/** Handle check events on right tree */
function onRightCheck(_node: unknown, checkedInfo: { checkedKeys: (string | number)[] }) {
  rightCheckedKeys.value = checkedInfo.checkedKeys.map(String)
}

/** Transfer checked nodes from left to right */
function transferToRight() {
  const keys = [...leftCheckedKeys.value]
  if (keys.length === 0) return

  // Collect all descendant keys for each checked node
  const allKeys = new Set<string>()
  for (const key of keys) {
    allKeys.add(key)
    const node = findNode(props.data, key)
    if (node) {
      for (const dk of collectDescendantKeys(node)) {
        allKeys.add(dk)
      }
    }
  }

  const newSelected = [...new Set([...props.modelValue, ...allKeys])]
  const leftKeys = props.data
    .filter((n) => !newSelected.includes(String(n[props.nodeKey])))
    .map((n) => String(n[props.nodeKey]))

  emit('update:modelValue', newSelected)
  emit('change', leftKeys, [...allKeys], 'right', [...allKeys])

  // Reset checked state on left tree
  ;(leftTreeRef.value as unknown as { setCheckedKeys: (keys: string[]) => void })?.setCheckedKeys([])
  leftCheckedKeys.value = []
}

/** Transfer checked nodes from right to left */
function transferToLeft() {
  const keys = [...rightCheckedKeys.value]
  if (keys.length === 0) return

  // Collect all descendant keys for each checked node
  const allKeys = new Set<string>()
  for (const key of keys) {
    allKeys.add(key)
    const node = findNode(props.data, key)
    if (node) {
      for (const dk of collectDescendantKeys(node)) {
        allKeys.add(dk)
      }
    }
  }

  const removeSet = new Set(allKeys)
  const newSelected = props.modelValue.filter((k) => !removeSet.has(k))
  const rightKeys = newSelected.filter((k) => {
    const node = findNode(props.data, k)
    return node != null
  })

  emit('update:modelValue', newSelected)
  emit('change', [...removeSet], rightKeys, 'left', [...allKeys])

  // Reset checked state on right tree
  ;(rightTreeRef.value as unknown as { setCheckedKeys: (keys: string[]) => void })?.setCheckedKeys([])
  rightCheckedKeys.value = []
}

/* ═══════════════════ Exposed API ════════════════════════════ */

defineExpose({
  leftTreeRef,
  rightTreeRef,
})
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────── */
.vc-tree-transfer {
  display: flex;
  align-items: stretch;
  gap: 16px;
  min-height: 320px;
}

/* ── Panels ────────────────────────────────────────── */
.vc-tree-transfer__panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.vc-tree-transfer__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #ebedf0;
  background: #fafbfc;
}

.vc-tree-transfer__panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.vc-tree-transfer__panel-count {
  font-size: 12px;
  color: #8b8fa3;
  background: #eef0f4;
  padding: 1px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.vc-tree-transfer__filter {
  padding: 8px 12px;
}

.vc-tree-transfer__panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
  min-height: 200px;
}

.vc-tree-transfer__panel-footer {
  padding: 8px 14px;
  border-top: 1px solid #ebedf0;
  background: #fafbfc;
}

/* ── Action buttons ────────────────────────────────── */
.vc-tree-transfer__actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
}

.vc-tree-transfer__btn {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 72px;
}

.vc-tree-transfer__btn-icon {
  font-size: 14px;
  line-height: 1;
}
</style>
