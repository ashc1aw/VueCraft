<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
        <h1 class="doc-title">TreeTransfer</h1>
        <p class="doc-desc">{{ t('treeTransfer.desc') }}</p>
      </div>

      <!-- ═══════════ Basic ═══════════ -->
      <section id="basic" class="sf-section">
        <h2 class="sf-section-title">{{ t('treeTransfer.basic.title') }}</h2>
        <p class="sf-section-desc">{{ t('treeTransfer.basic.desc') }}</p>
        <div class="sf-demo-card">
          <div class="sf-demo-preview">
            <TreeTransfer
              v-model="basicSelected"
              :data="demoTreeData"
              :left-title="t('treeTransfer.demo.available')"
              :right-title="t('treeTransfer.demo.selected')"
              :left-to-right-text="t('treeTransfer.demo.add')"
              :right-to-left-text="t('treeTransfer.demo.remove')"
              @change="onTransferChange"
            />
          </div>
          <div class="sf-demo-divider" />
          <div class="sf-demo-code__toggle" @click="toggleCode('basic')">
            <span class="sf-demo-code__toggle-icon">{{ codeExpanded.basic ? '▼' : '▶' }}</span>
            <span>{{ codeExpanded.basic ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
          </div>
          <div v-show="codeExpanded.basic" class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode('basic')">
                {{ copied === 'basic' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="basicHighlighted" />
          </div>
        </div>
      </section>

      <!-- ═══════════ Filterable ═══════════ -->
      <section id="filterable" class="sf-section">
        <h2 class="sf-section-title">{{ t('treeTransfer.filterable.title') }}</h2>
        <p class="sf-section-desc">{{ t('treeTransfer.filterable.desc') }}</p>
        <div class="sf-demo-card">
          <div class="sf-demo-preview">
            <TreeTransfer
              v-model="filterSelected"
              :data="demoTreeData"
              :left-title="t('treeTransfer.demo.available')"
              :right-title="t('treeTransfer.demo.selected')"
              :left-to-right-text="t('treeTransfer.demo.add')"
              :right-to-left-text="t('treeTransfer.demo.remove')"
              :filterable="true"
              :filter-placeholder="t('searchBar.demo.keyword')"
            />
          </div>
          <div class="sf-demo-divider" />
          <div class="sf-demo-code__toggle" @click="toggleCode('filterable')">
            <span class="sf-demo-code__toggle-icon">{{ codeExpanded.filterable ? '▼' : '▶' }}</span>
            <span>{{ codeExpanded.filterable ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
          </div>
          <div v-show="codeExpanded.filterable" class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode('filterable')">
                {{ copied === 'filterable' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="filterableHighlighted" />
          </div>
        </div>
      </section>

      <!-- ═══════════ API ═══════════ -->
      <section id="api" class="sf-section">
        <h2 class="sf-section-title">{{ t('treeTransfer.api.title') }}</h2>

        <h3 class="sf-subtitle">{{ t('treeTransfer.api.props') }}</h3>
        <el-table :data="propsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="180" />
          <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="240" />
          <el-table-column prop="default" :label="t('schemaForm.colName.default')" width="100" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('treeTransfer.api.events') }}</h3>
        <el-table :data="eventsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="190" />
          <el-table-column prop="params" :label="t('schemaForm.colName.type')" width="340" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('treeTransfer.api.slots') }}</h3>
        <el-table :data="slotsTable" border stripe size="small" class="sf-api-table">
          <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="150" />
          <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
        </el-table>

        <h3 class="sf-subtitle">{{ t('treeTransfer.api.methods') }}</h3>
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
import { TreeTransfer } from 'vuecraft'
import type { TreeNode } from 'vuecraft'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'

const { t } = useI18n()

/* ═══════════════ TOC / Scroll Spy ═══════════════════ */

const tocItems = computed(() => [
  { id: 'basic', label: t('treeTransfer.toc.basic') },
  { id: 'filterable', label: t('treeTransfer.toc.filterable') },
  { id: 'api', label: t('treeTransfer.toc.api') },
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

function hl(code: string) { return Prism.highlight(code.trim(), Prism.languages.typescript!, 'typescript') }
function hlMarkup(code: string) { return Prism.highlight(code.trim(), Prism.languages.markup!, 'markup') }

/* ═══════════════ Code folding ═══════════════════ */

const codeExpanded = ref<Record<string, boolean>>({ basic: false, filterable: false })
function toggleCode(key: string) { codeExpanded.value[key] = !codeExpanded.value[key] }

const copied = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null
const rawCodes: Record<string, string> = {}

async function copyCode(key: string) {
  const code = rawCodes[key]; if (!code) return
  try { await navigator.clipboard.writeText(code) } catch {
    const ta = document.createElement('textarea'); ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
  }
  copied.value = key; if (copyTimer) clearTimeout(copyTimer); copyTimer = setTimeout(() => (copied.value = null), 2000)
}

/* ═══════════════ Demo Tree Data ═══════════════════ */

const demoTreeData: TreeNode[] = [
  { id: '1', label: t('treeTransfer.demo.deptA'), children: [
    { id: '1-1', label: t('treeTransfer.demo.teamA1') },
    { id: '1-2', label: t('treeTransfer.demo.teamA2') },
  ]},
  { id: '2', label: t('treeTransfer.demo.deptB'), children: [
    { id: '2-1', label: t('treeTransfer.demo.teamB1') },
    { id: '2-2', label: t('treeTransfer.demo.teamB2'), children: [
      { id: '2-2-1', label: t('treeTransfer.demo.subB21') },
    ]},
  ]},
]

/* ═══════════════ Basic ═══════════════════════ */

const basicTemplateCode = `<TreeTransfer
  v-model="selected"
  :data="treeData"
  left-title="Available"
  right-title="Selected"
  left-to-right-text="Add"
  right-to-left-text="Remove"
  @change="onChange"
/>`

const basicScriptCode = `import { ref } from 'vue'
import { TreeTransfer } from 'vuecraft'
import type { TreeNode } from 'vuecraft'

const treeData: TreeNode[] = [
  { id: '1', label: 'Dept A', children: [
    { id: '1-1', label: 'Team A-1' },
    { id: '1-2', label: 'Team A-2' },
  ]},
  { id: '2', label: 'Dept B', children: [
    { id: '2-1', label: 'Team B-1' },
    { id: '2-2', label: 'Team B-2', children: [
      { id: '2-2-1', label: 'Sub B-2-1' },
    ]},
  ]},
]

const selected = ref<string[]>([])

function onChange(leftKeys, rightKeys, direction, movedKeys) {
  console.log(direction, movedKeys)
}`

const basicHighlighted = computed(() => hlMarkup(basicTemplateCode) + '\n' + hl(basicScriptCode))
const basicSelected = ref<string[]>([])
const changeLog = ref('')

function onTransferChange(
  _leftKeys: string[],
  _rightKeys: string[],
  direction: 'left' | 'right',
  movedKeys: string[],
) {
  const dirLabel = direction === 'right' ? t('treeTransfer.demo.added') : t('treeTransfer.demo.removed')
  changeLog.value = `${t('treeTransfer.demo.changeLabel')}: ${dirLabel} [${movedKeys.join(', ')}]`
}

/* ═══════════════ Filterable ══════════════════ */

const filterableTemplateCode = `<TreeTransfer
  v-model="selected"
  :data="treeData"
  left-title="Available"
  right-title="Selected"
  left-to-right-text="Add"
  right-to-left-text="Remove"
  :filterable="true"
  filter-placeholder="Search..."
/>`

const filterableHighlighted = computed(() => hlMarkup(filterableTemplateCode))
const filterSelected = ref<string[]>([])

/* ═══════════════ Raw codes ═══════════════════ */
rawCodes.basic = basicTemplateCode + '\n' + basicScriptCode
rawCodes.filterable = filterableTemplateCode

/* ═══════════════ API Tables ═══════════════════ */

const propsTable = computed(() => [
  { name: 'data', type: 'TreeNode[]', default: '—', desc: t('treeTransfer.api.table.data') },
  { name: 'modelValue', type: 'string[]', default: '[]', desc: t('treeTransfer.api.table.modelValue') },
  { name: 'leftTitle', type: 'string', default: '—', desc: t('treeTransfer.api.table.leftTitle') },
  { name: 'rightTitle', type: 'string', default: '—', desc: t('treeTransfer.api.table.rightTitle') },
  { name: 'leftToRightText', type: 'string', default: '—', desc: t('treeTransfer.api.table.leftToRightText') },
  { name: 'rightToLeftText', type: 'string', default: '—', desc: t('treeTransfer.api.table.rightToLeftText') },
  { name: 'filterable', type: 'boolean', default: 'false', desc: t('treeTransfer.api.table.filterable') },
  { name: 'filterPlaceholder', type: 'string', default: "''", desc: t('treeTransfer.api.table.filterPlaceholder') },
  { name: 'nodeKey', type: 'string', default: "'id'", desc: t('treeTransfer.api.table.nodeKey') },
  { name: 'labelKey', type: 'string', default: "'label'", desc: t('treeTransfer.api.table.labelKey') },
  { name: 'childrenKey', type: 'string', default: "'children'", desc: t('treeTransfer.api.table.childrenKey') },
  { name: 'disabled', type: 'boolean', default: 'false', desc: t('treeTransfer.api.table.disabled') },
  { name: 'size', type: "'default' | 'small'", default: "'default'", desc: t('treeTransfer.api.table.size') },
])

const eventsTable = computed(() => [
  { name: 'update:modelValue', params: '(value: string[])', desc: t('treeTransfer.api.table.updateEvent') },
  { name: 'change', params: '(leftKeys, rightKeys, direction, movedKeys)', desc: t('treeTransfer.api.table.changeEvent') },
])

const slotsTable = computed(() => [
  { name: 'left-footer', desc: t('treeTransfer.api.table.leftFooterSlot') },
  { name: 'right-footer', desc: t('treeTransfer.api.table.rightFooterSlot') },
])

const methodsTable = computed(() => [
  { name: 'leftTreeRef', type: 'ElTreeInstance', desc: t('treeTransfer.api.table.leftTreeRef') },
  { name: 'rightTreeRef', type: 'ElTreeInstance', desc: t('treeTransfer.api.table.rightTreeRef') },
])
</script>

<style scoped>
/* ═══════════════ Page Layout ═══════════════════════ */
.doc-layout { display: flex; gap: 52px; align-items: flex-start; }
.doc-page { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 44px; padding-bottom: 60px; max-width: 780px; }

/* ═══════════════ Hero ═════════════════════════════ */
.doc-hero { display: flex; flex-direction: column; gap: 10px; }
.doc-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 30px; font-weight: 780; letter-spacing: -0.8px; color: #1a1a2e; margin: 0; }
.doc-desc { font-size: 14px; color: #606780; line-height: 1.7; margin: 0; max-width: 640px; }

/* ═══════════════ Section ══════════════════════════ */
.sf-section { display: flex; flex-direction: column; gap: 10px; }
.sf-section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a2e; margin: 0; letter-spacing: -0.3px; }
.sf-section-desc { font-size: 14px; color: #606780; line-height: 1.65; margin: 0; }
.sf-section-desc code { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #eef0f4; color: #409eff; padding: 1.5px 7px; border-radius: 4px; font-weight: 700; }

/* ═══════════════ Demo Card ════════════════════════ */
.sf-demo-card { border: 1px solid #ebedf0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.sf-demo-preview { padding: 28px 32px; background: #fafbfc; }
.sf-demo-divider { height: 1px; background: #ebedf0; }
.sf-onchange-hint { margin-bottom: 12px; font-size: 13px; color: #409eff; font-weight: 500; word-break: break-all; }

/* ═══════════════ Code Toggle / Block ══════════════ */
.sf-demo-code__toggle { display: flex; align-items: center; gap: 6px; padding: 8px 20px; background: #fafbfc; cursor: pointer; font-size: 14px; color: #8b8fa3; user-select: none; transition: color .15s, background .15s; }
.sf-demo-code__toggle:hover { color: #1a1a2e; background: #f0f1f3; }
.sf-demo-code__toggle-icon { font-size: 10px; flex-shrink: 0; }
.sf-demo-code { background: #fafbfc; position: relative; }
.sf-demo-code__header { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #f0f1f3; border-bottom: 1px solid #ebedf0; }
.sf-demo-code__dot { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; box-shadow: 18px 0 0 #febc2e, 36px 0 0 #28c840; }
.sf-demo-code__lang { margin-left: 38px; font-size: 14px; font-weight: 600; color: #8b8fa3; text-transform: uppercase; letter-spacing: .8px; }
.sf-demo-code__copy { margin-left: auto; padding: 3px 10px; font-size: 14px; font-weight: 500; color: #8b8fa3; background: transparent; border: none; border-radius: 4px; cursor: pointer; transition: color .15s; font-family: inherit; }
.sf-demo-code__copy:hover { color: #1a1a2e; }
.code-block { margin: 0; padding: 18px 22px; overflow-x: auto; font-family: 'JetBrains Mono','Fira Code','Cascadia Code',monospace; font-size: 14px; line-height: 1.75; color: #1a1a2e; white-space: pre; tab-size: 2; }

/* ═══════════════ Prism Tokens ═════════════════════ */
.code-block :deep(.token.comment) { color: #8b949e; font-style: italic; }
.code-block :deep(.token.keyword) { color: #cf222e; }
.code-block :deep(.token.string) { color: #0a3069; }
.code-block :deep(.token.function) { color: #8250df; }
.code-block :deep(.token.punctuation) { color: #484f58; }
.code-block :deep(.token.property) { color: #0550ae; }
.code-block :deep(.token.number) { color: #0550ae; }

/* ═══════════════ API Tables ═══════════════════════ */
.sf-subtitle { font-size: 16px; font-weight: 650; color: #1a1a2e; margin: 20px 0 10px; letter-spacing: -0.2px; }
.sf-subtitle:first-of-type { margin-top: 4px; }
.sf-api-table { font-size: 14px; }
.sf-api-table :deep(th) { font-weight: 600; color: #1a1a2e; background: #f5f6f8; text-align: left; padding: 10px 14px; }
.sf-api-table :deep(td) { color: #303133; padding: 9px 14px; vertical-align: middle; }
.sf-api-table :deep(td:first-child) { font-family: 'JetBrains Mono','Fira Code',monospace; font-size: 13px; color: #409eff; font-weight: 700; }
.sf-api-table :deep(td:nth-child(3)) { text-align: center; font-size: 13px; }

/* ═══════════════ TOC Sidebar ══════════════════════ */
.doc-toc { position: sticky; top: 28px; width: 156px; flex-shrink: 0; padding-left: 60px; border-left: 1px solid #ebedf0; }
.doc-toc__title { font-size: 14px; font-weight: 600; color: #8b8fa3; text-transform: uppercase; letter-spacing: .6px; margin: 0 0 12px; }
.doc-toc__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.doc-toc__link { display: block; font-size: 14px; color: #8b8fa3; text-decoration: none; line-height: 1.5; transition: color .15s; padding: 2px 0; }
.doc-toc__link:hover { color: #1a1a2e; }
.doc-toc__item.is-active .doc-toc__link { color: #409eff; font-weight: 600; }
</style>
