<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
        <h1 class="doc-title">TablePro</h1>
        <p class="doc-desc">{{ t('tablePro.desc') }}</p>
      </div>

      <!-- ═══════════ Basic ═══════════ -->
      <section id="basic" class="sf-section">
        <h2 class="sf-section-title">{{ t('tablePro.basic.title') }}</h2>
        <p class="sf-section-desc">{{ t('tablePro.basic.desc') }}</p>
        <div class="sf-demo-card">
          <div class="sf-demo-preview">
            <TablePro :columns="basicColumns" :data="basicData" :pagination="basicPagination" />
          </div>
          <div class="sf-demo-divider"></div>
          <div class="sf-demo-code__toggle" @click="toggleCode('basic')">
            <span class="sf-demo-code__toggle-icon">{{ codeExpanded.basic ? '▼' : '▶' }}</span>
            <span>{{ codeExpanded.basic ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
          </div>
          <div v-show="codeExpanded.basic" class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot"></span>
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode('basic')">
                {{ copied === 'basic' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="basicHighlighted"></pre>
          </div>
        </div>
      </section>

      <!-- ═══════════ Selection ═══════════ -->
      <section id="selection" class="sf-section">
        <h2 class="sf-section-title">{{ t('tablePro.selection.title') }}</h2>
        <p class="sf-section-desc">{{ t('tablePro.selection.desc') }}</p>
        <div class="sf-demo-card">
          <div class="sf-demo-preview">
            <div style="margin-bottom:12px;font-size:14px" v-if="selected.length">
              {{ t('tablePro.selection.selected') }}: {{ selected.map(r => r.name).join(', ') }}
            </div>
            <TablePro
              :columns="selectionColumns"
              :data="selectionData"
              :selection="true"
              :pagination="false"
              @selection-change="onSelectionChange"
            />
          </div>
          <div class="sf-demo-divider"></div>
          <div class="sf-demo-code__toggle" @click="toggleCode('selection')">
            <span class="sf-demo-code__toggle-icon">{{ codeExpanded.selection ? '▼' : '▶' }}</span>
            <span>{{ codeExpanded.selection ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
          </div>
          <div v-show="codeExpanded.selection" class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot"></span>
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode('selection')">
                {{ copied === 'selection' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="selectionHighlighted"></pre>
          </div>
        </div>
      </section>

      <!-- ═══════════ API ═══════════ -->
      <section id="api" class="sf-section">
        <h2 class="sf-section-title">{{ t('tablePro.api.title') }}</h2>

        <h3 class="sf-subtitle">{{ t('tablePro.api.props') }}</h3>
        <el-table :data="propsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="180" />
          <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="260" />
          <el-table-column prop="default" :label="t('schemaForm.colName.default')" width="110" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('tablePro.api.events') }}</h3>
        <el-table :data="eventsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="210" />
          <el-table-column prop="params" :label="t('schemaForm.colName.type')" width="310" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('tablePro.api.slots') }}</h3>
        <el-table :data="slotsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="150" />
          <el-table-column prop="scope" :label="t('schemaForm.colName.type')" width="320" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('tablePro.api.methods') }}</h3>
        <el-table :data="methodsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="180" />
          <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="240" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>
      </section>
    </div>

    <!-- ═══════════ TOC ═══════════ -->
    <aside class="doc-toc">
      <h4 class="doc-toc__title">Contents</h4>
      <ul class="doc-toc__list">
        <li v-for="item in tocItems" :key="item.id" class="doc-toc__item" :class="{ 'is-active': activeToc === item.id }">
          <a :href="'#' + item.id" class="doc-toc__link" @click.prevent="scrollToSection(item.id)">{{ item.label }}</a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TablePro } from 'vuecraft'
import type { TableColumn, PaginationConfig } from 'vuecraft'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'

const { t } = useI18n()

/* ═══════════════ TOC / Scroll Spy ═══════════════════ */

const tocItems = computed(() => [
  { id: 'basic', label: t('tablePro.toc.basic') },
  { id: 'selection', label: t('tablePro.toc.selection') },
  { id: 'api', label: t('tablePro.toc.api') },
])

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const activeToc = ref('basic')
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length > 0 && visible[0]) activeToc.value = visible[0].target.id
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )
  tocItems.value.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
  onUnmounted(() => observer.disconnect())
})

/* ═══════════════ Highlight ═══════════════════ */

function hl(code: string) {
  return Prism.highlight(code.trim(), Prism.languages.typescript!, 'typescript')
}
function hlMarkup(code: string) {
  return Prism.highlight(code.trim(), Prism.languages.markup!, 'markup')
}

/* ═══════════════ Code folding ═══════════════════ */

const codeExpanded = ref<Record<string, boolean>>({ basic: false, selection: false })
function toggleCode(key: string) { codeExpanded.value[key] = !codeExpanded.value[key] }

const copied = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null
const rawCodes: Record<string, string> = {}

async function copyCode(key: string) {
  const code = rawCodes[key]
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = code
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = key
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copied.value = null), 2000)
}

/* ═══════════════ Generate mock data ══════════════ */

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: i % 3 === 0 ? 'active' : 'inactive',
    date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

/* ═══════════════ Basic ═══════════════════════ */

const basicTemplateCode = `<TablePro :columns="columns" :data="tableData" />`

const basicScriptCode = `import { TablePro } from 'vuecraft'
import type { TableColumn, PaginationConfig } from 'vuecraft'

const columns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name' },
  { prop: 'status', label: 'Status' },
  { prop: 'date', label: 'Date', sortable: true },
]

const pagination: PaginationConfig = {
  pageSize: 5,
  pageSizes: [5, 10, 20],
}`

const basicHighlighted = computed(() => hlMarkup(basicTemplateCode) + '\n' + hl(basicScriptCode))
const basicColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: t('schemaForm.demo.username') },
  { prop: 'status', label: t('searchBar.demo.status') },
  { prop: 'date', label: t('searchBar.demo.date'), sortable: true },
]
const basicData = makeItems(12)
const basicPagination: PaginationConfig = { pageSize: 5, pageSizes: [5, 10, 20] }

/* ═══════════════ Selection ═══════════════════ */

const selectionTemplateCode = `<TablePro
  :columns="columns"
  :data="tableData"
  :selection="true"
  :pagination="false"
  @selection-change="onChange"
/>`

const selectionScriptCode = `const columns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name' },
]

function onChange(rows) {
  console.log('Selected:', rows)
}`

const selectionHighlighted = computed(() => hlMarkup(selectionTemplateCode) + '\n' + hl(selectionScriptCode))
const selectionColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: t('schemaForm.demo.username') },
  { prop: 'status', label: t('searchBar.demo.status') },
]
const selectionData = makeItems(6)
const selected = ref<Record<string, unknown>[]>([])
function onSelectionChange(rows: Record<string, unknown>[]) { selected.value = rows }

/* ═══════════════ Raw codes ═══════════════════ */
rawCodes.basic = basicTemplateCode + '\n' + basicScriptCode
rawCodes.selection = selectionTemplateCode + '\n' + selectionScriptCode

/* ═══════════════ API Tables ═══════════════════ */

const propsTable = computed(() => [
  { name: 'columns', type: 'TableColumn[]', default: '—', desc: t('tablePro.api.table.columns') },
  { name: 'data', type: 'Record<string, unknown>[]', default: '—', desc: t('tablePro.api.table.data') },
  { name: 'loading', type: 'boolean', default: 'false', desc: t('tablePro.api.table.loading') },
  { name: 'pagination', type: 'PaginationConfig | false', default: '{ pageSize: 10, ... }', desc: t('tablePro.api.table.pagination') },
  { name: 'selection', type: 'boolean', default: 'false', desc: t('tablePro.api.table.selection') },
  { name: 'columnConfig', type: 'boolean', default: 'false', desc: t('tablePro.api.table.columnConfig') },
  { name: 'columnConfigKey', type: 'string', default: '—', desc: t('tablePro.api.table.columnConfigKey') },
  { name: 'emptyText', type: 'string', default: "'No data'", desc: t('tablePro.api.table.emptyText') },
])

const eventsTable = computed(() => [
  { name: 'selection-change', params: '(rows: Record<string, unknown>[])', desc: t('tablePro.api.table.selectionChange') },
  { name: 'page-change', params: '(page: number)', desc: t('tablePro.api.table.pageChange') },
  { name: 'page-size-change', params: '(size: number)', desc: t('tablePro.api.table.pageSizeChange') },
])

const slotsTable = computed(() => [
  { name: 'toolbar', scope: '—', desc: t('tablePro.api.table.toolbarSlot') },
  { name: 'empty', scope: '—', desc: t('tablePro.api.table.emptySlot') },
  { name: '[dynamic]', scope: '{ row, column, $index }', desc: t('tablePro.api.table.columnSlot') },
])

const methodsTable = computed(() => [
  { name: 'tableRef', type: 'ElTableInstance', desc: t('tablePro.api.table.tableRef') },
])
</script>

<style scoped>
.doc-layout { display: flex; gap: 52px; align-items: flex-start; }
.doc-page { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 44px; padding-bottom: 60px; max-width: 780px; }
.doc-hero { display: flex; flex-direction: column; gap: 10px; }
.doc-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 30px; font-weight: 780; letter-spacing: -0.8px; color: #1a1a2e; margin: 0; }
.doc-desc { font-size: 14px; color: #606780; line-height: 1.7; margin: 0; max-width: 640px; }
.sf-section { display: flex; flex-direction: column; gap: 10px; }
.sf-section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a2e; margin: 0; letter-spacing: -0.3px; }
.sf-section-desc { font-size: 14px; color: #606780; line-height: 1.65; margin: 0; }
.sf-section-desc code { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #eef0f4; color: #409eff; padding: 1.5px 7px; border-radius: 4px; font-weight: 700; }
.sf-demo-card { border: 1px solid #ebedf0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.sf-demo-preview { padding: 28px 32px; background: #fafbfc; }
.sf-demo-divider { height: 1px; background: #ebedf0; }
.sf-onchange-hint { margin-top: 12px; font-size: 13px; color: #409eff; font-weight: 500; word-break: break-all; }
.sf-demo-code__toggle { display: flex; align-items: center; gap: 6px; padding: 8px 20px; background: #fafbfc; cursor: pointer; font-size: 14px; color: #8b8fa3; user-select: none; transition: color .15s,background .15s; }
.sf-demo-code__toggle:hover { color: #1a1a2e; background: #f0f1f3; }
.sf-demo-code__toggle-icon { font-size: 10px; flex-shrink: 0; }
.sf-demo-code { background: #fafbfc; position: relative; }
.sf-demo-code__header { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #f0f1f3; border-bottom: 1px solid #ebedf0; }
.sf-demo-code__dot { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; box-shadow: 18px 0 0 #febc2e, 36px 0 0 #28c840; }
.sf-demo-code__lang { margin-left: 38px; font-size: 14px; font-weight: 600; color: #8b8fa3; text-transform: uppercase; letter-spacing: .8px; }
.sf-demo-code__copy { margin-left: auto; padding: 3px 10px; font-size: 14px; font-weight: 500; color: #8b8fa3; background: transparent; border: none; border-radius: 4px; cursor: pointer; transition: color .15s; font-family: inherit; }
.sf-demo-code__copy:hover { color: #1a1a2e; }
.code-block { margin: 0; padding: 18px 22px; overflow-x: auto; font-family: 'JetBrains Mono','Fira Code','Cascadia Code',monospace; font-size: 14px; line-height: 1.75; color: #1a1a2e; white-space: pre; tab-size: 2; }
.code-block :deep(.token.comment) { color: #8b949e; font-style: italic; }
.code-block :deep(.token.keyword) { color: #cf222e; }
.code-block :deep(.token.string) { color: #0a3069; }
.code-block :deep(.token.function) { color: #8250df; }
.code-block :deep(.token.punctuation) { color: #484f58; }
.code-block :deep(.token.property) { color: #0550ae; }
.code-block :deep(.token.number) { color: #0550ae; }
.sf-subtitle { font-size: 16px; font-weight: 650; color: #1a1a2e; margin: 20px 0 10px; letter-spacing: -0.2px; }
.sf-subtitle:first-of-type { margin-top: 4px; }
.sf-api-table { font-size: 14px; }
.sf-api-table :deep(th) { font-weight: 600; color: #1a1a2e; background: #f5f6f8; text-align: left; padding: 10px 14px; }
.sf-api-table :deep(td) { color: #303133; padding: 9px 14px; vertical-align: middle; }
.sf-api-table :deep(td:first-child) { font-family: 'JetBrains Mono','Fira Code',monospace; font-size: 13px; color: #409eff; font-weight: 700; }
.sf-api-table :deep(td:nth-child(3)) { text-align: center; font-size: 13px; }
.doc-toc { position: sticky; top: 28px; width: 156px; flex-shrink: 0; padding-left: 60px; border-left: 1px solid #ebedf0; }
.doc-toc__title { font-size: 14px; font-weight: 600; color: #8b8fa3; text-transform: uppercase; letter-spacing: .6px; margin: 0 0 12px; }
.doc-toc__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.doc-toc__link { display: block; font-size: 14px; color: #8b8fa3; text-decoration: none; line-height: 1.5; transition: color .15s; padding: 2px 0; }
.doc-toc__link:hover { color: #1a1a2e; }
.doc-toc__item.is-active .doc-toc__link { color: #409eff; font-weight: 600; }
</style>
