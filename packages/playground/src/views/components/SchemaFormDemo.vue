<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
      <h1 class="doc-title">{{ t('schemaForm.title') }}</h1>
      <p class="doc-desc">{{ t('schemaForm.desc') }}</p>
    </div>

    <!-- ═══════════ Basic ═══════════ -->
    <section id="basic" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.basic.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.basic.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm v-model="basicModel" :schema="basicSchema" />
          <p v-if="basicChangeCount > 0" class="sf-onchange-hint">
            {{ t('schemaForm.demo.changed', { n: basicChangeCount }) }}
          </p>
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

    <!-- ═══════════ Grid Layout ═══════════ -->
    <section id="grid" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.grid.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.grid.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm v-model="gridModel" :schema="gridSchema" />
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('grid')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.grid ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.grid ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.grid" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('grid')">
              {{ copied === 'grid' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="gridHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ Conditional ═══════════ -->
    <section id="conditional" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.conditional.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.conditional.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm v-model="conditionalModel" :schema="conditionalSchema" />
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('conditional')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.conditional ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.conditional ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.conditional" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('conditional')">
              {{ copied === 'conditional' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="conditionalHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ Validation ═══════════ -->
    <section id="validation" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.validation.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.validation.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm
            ref="validationFormRef"
            v-model="validationModel"
            :schema="validationSchema"
          />
          <div class="sf-demo-actions">
            <el-button type="primary" @click="handleValidate">{{ t('schemaForm.demo.submit') }}</el-button>
            <el-button @click="handleReset">{{ t('schemaForm.demo.reset') }}</el-button>
          </div>
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('validation')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.validation ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.validation ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.validation" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('validation')">
              {{ copied === 'validation' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="validationHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ Custom Widgets ═══════════ -->
    <section id="custom-widget" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.customWidget.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.customWidget.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm
            v-model="customWidgetModel"
            :schema="customWidgetSchema"
            :custom-widgets="customWidgets"
          />
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('customWidget')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.customWidget ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.customWidget ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.customWidget" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('customWidget')">
              {{ copied === 'customWidget' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="customWidgetHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ Slot Override ═══════════ -->
    <section id="slot" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.slot.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.slot.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <SchemaForm
            v-model="slotModel"
            :schema="slotSchema"
          >
            <template #price-label="{ value, onUpdate }">
              <div class="sf-slot-demo">
                <span class="sf-slot-demo__prefix">¥</span>
                <el-input-number
                  :model-value="value"
                  :placeholder="t('schemaForm.demo.pricePlaceholder')"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 200px"
                  @update:model-value="onUpdate"
                />
                <span class="sf-slot-demo__suffix">CNY</span>
              </div>
            </template>
          </SchemaForm>
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('slot')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.slot ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.slot ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.slot" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('slot')">
              {{ copied === 'slot' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="slotHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ Form Display ═══════════ -->
    <section id="display" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.display.title') }}</h2>
      <p class="sf-section-desc">{{ t('schemaForm.display.desc') }}</p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <div class="sf-display-controls">
            <el-radio-group v-model="displaySize" size="small" @change="() => {}">
              <el-radio-button value="large">{{ t('schemaForm.demo.sizeLarge') }}</el-radio-button>
              <el-radio-button value="default">{{ t('schemaForm.demo.sizeDefault') }}</el-radio-button>
              <el-radio-button value="small">{{ t('schemaForm.demo.sizeSmall') }}</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="displayLabelPos" size="small" class="sf-display-controls__gap">
              <el-radio-button value="left">{{ t('schemaForm.demo.labelLeft') }}</el-radio-button>
              <el-radio-button value="right">{{ t('schemaForm.demo.labelRight') }}</el-radio-button>
              <el-radio-button value="top">{{ t('schemaForm.demo.labelTop') }}</el-radio-button>
            </el-radio-group>
            <el-checkbox v-model="displayInline" size="small">{{ t('schemaForm.demo.inlineMode') }}</el-checkbox>
          </div>
          <SchemaForm v-model="displayModel" :schema="displaySchema" />
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('display')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.display ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.display ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.display" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('display')">
              {{ copied === 'display' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="displayHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ View Mode ═══════════ -->
    <section id="view-mode" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.viewMode.title') }}</h2>
      <p class="sf-section-desc">
        {{ t('schemaForm.viewMode.desc') }}
      </p>
      <div class="sf-demo-card">
        <div class="sf-demo-preview">
          <div class="sf-display-controls">
            <span style="font-size:14px;font-weight:600;color:#1a1a2e">Mode:</span>
            <el-switch
              :model-value="viewMode === 'view'"
              :active-text="t('schemaForm.viewMode.toggleView')"
              :inactive-text="t('schemaForm.viewMode.toggleEdit')"
              size="small"
              @update:model-value="(v: boolean) => viewMode = v ? 'view' : 'edit'"
            />
          </div>
          <SchemaForm v-model="viewModeModel" :schema="viewModeSchema" />
        </div>
        <div class="sf-demo-divider"></div>
        <div class="sf-demo-code__toggle" @click="toggleCode('viewMode')">
          <span class="sf-demo-code__toggle-icon">{{ codeExpanded.viewMode ? '▼' : '▶' }}</span>
          <span>{{ codeExpanded.viewMode ? t('schemaForm.demo.hideCode') : t('schemaForm.demo.showCode') }}</span>
        </div>
        <div v-show="codeExpanded.viewMode" class="sf-demo-code">
          <div class="sf-demo-code__header">
            <span class="sf-demo-code__dot"></span>
            <span class="sf-demo-code__lang">Vue SFC</span>
            <button class="sf-demo-code__copy" @click="copyCode('viewMode')">
              {{ copied === 'viewMode' ? t('schemaForm.demo.copied') : t('schemaForm.demo.copy') }}
            </button>
          </div>
          <pre class="code-block" v-html="viewModeHighlighted"></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════ API ═══════════ -->
    <section id="api" class="sf-section">
      <h2 class="sf-section-title">{{ t('schemaForm.api.title') }}</h2>

      <h3 class="sf-subtitle">{{ t('schemaForm.props') }}</h3>
      <el-table :data="propsTable" border stripe size="small" class="sf-api-table">
        <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="170" />
        <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="210" />
        <el-table-column prop="default" :label="t('schemaForm.colName.default')" width="100" />
        <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
      </el-table>

      <h3 class="sf-subtitle">{{ t('schemaForm.formSchema') }}</h3>
      <el-table :data="formSchemaTable" border stripe size="small" class="sf-api-table">
        <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="170" />
        <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="210" />
        <el-table-column prop="default" :label="t('schemaForm.colName.default')" width="100" />
        <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
      </el-table>

      <h3 class="sf-subtitle">{{ t('schemaForm.events') }}</h3>
      <el-table :data="eventsTable" border stripe size="small" class="sf-api-table">
        <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="190" />
        <el-table-column prop="params" :label="t('schemaForm.colName.type')" width="270" />
        <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
      </el-table>

      <h3 class="sf-subtitle">{{ t('schemaForm.methods') }}</h3>
      <el-table :data="methodsTable" border stripe size="small" class="sf-api-table">
        <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="170" />
        <el-table-column prop="returns" :label="t('schemaForm.colName.type')" width="200" />
        <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
      </el-table>

      <h3 class="sf-subtitle">{{ t('schemaForm.fieldConfig') }}</h3>
      <el-table :data="fieldConfigTable" border stripe size="small" class="sf-api-table">
        <el-table-column prop="name" :label="t('schemaForm.colName.name')" width="160" />
        <el-table-column prop="type" :label="t('schemaForm.colName.type')" width="210" />
        <el-table-column prop="default" :label="t('schemaForm.colName.default')" width="100" />
        <el-table-column prop="desc" :label="t('schemaForm.colName.desc')" min-width="200" />
      </el-table>
    </section>
    </div>
    <!-- ═══════════ TOC Sidebar ═══════════ -->
    <aside class="doc-toc">
      <h4 class="doc-toc__title">Contents</h4>
      <ul class="doc-toc__list">
        <li
          v-for="item in tocItems"
          :key="item.id"
          class="doc-toc__item"
          :class="{ 'is-active': activeToc === item.id }"
        >
          <a :href="'#' + item.id" class="doc-toc__link" @click.prevent="scrollToSection(item.id)">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { SchemaForm } from 'vuecraft'
import type { FormSchema, CustomWidgetsMap } from 'vuecraft'

const { t } = useI18n()
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'

/* ═══════════════ TOC / Scroll Spy ═══════════════════ */

const tocItems = computed(() => [
  { id: 'basic', label: t('schemaForm.toc.basic') },
  { id: 'grid', label: t('schemaForm.toc.grid') },
  { id: 'conditional', label: t('schemaForm.toc.conditional') },
  { id: 'validation', label: t('schemaForm.toc.validation') },
  { id: 'custom-widget', label: t('schemaForm.toc.customWidget') },
  { id: 'slot', label: t('schemaForm.toc.slot') },
  { id: 'display', label: t('schemaForm.toc.display') },
  { id: 'view-mode', label: t('schemaForm.toc.viewMode') },
  { id: 'api', label: t('schemaForm.toc.api') },
])

const activeToc = ref('basic')

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length > 0 && visible[0]) {
        activeToc.value = visible[0].target.id
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )
  tocItems.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
  onUnmounted(() => observer.disconnect())
})

/* ═══════════════ Highlight helper ═══════════════════ */

/**
 * Highlight a combined Vue SFC code snippet.
 * Template lines are prefixed with `// ` and rendered as comments (grey).
 * Script lines get full TypeScript syntax tokens.
 */
function hl(code: string): string {
  return Prism.highlight(code.trim(), Prism.languages.typescript!, 'typescript')
}

function hlMarkup(code: string): string {
  return Prism.highlight(code.trim(), Prism.languages.markup!, 'markup')
}

/* ═══════════════ Code folding ═══════════════════════ */

const codeExpanded = ref<Record<string, boolean>>({
  basic: false,
  grid: false,
  conditional: false,
  validation: false,
  customWidget: false,
  slot: false,
  display: false,
  viewMode: false,
})

function toggleCode(key: string) {
  codeExpanded.value[key] = !codeExpanded.value[key]
}

/* ═══════════════ Copy to clipboard ══════════════════ */

const copied = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null
const rawCodes: Record<string, string> = {}

async function copyCode(key: string) {
  const code = rawCodes[key]
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    copied.value = key
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea')
    ta.value = code
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = key
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = null
    }, 2000)
  }
}

/* ═══════════════ Basic Demo ═════════════════════════ */

const basicTemplateCode = `<SchemaForm v-model="formData" :schema="schema" />`

const basicScriptCode = `import { ref } from 'vue'
import { SchemaForm } from 'vuecraft'
import type { FormSchema } from 'vuecraft'

const schema: FormSchema = {
  fields: [
    {
      key: 'username',
      type: 'input',
      label: 'Username',
      tips: 'Must be 3–20 characters',
      onChange: (val) => console.log('changed:', val),
    },
    {
      key: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Regular User', value: 'user' },
      ],
    },
    { key: 'active', type: 'switch', label: 'Active' },
  ],
}

const formData = ref({
  username: 'admin',
  role: 'admin',
  active: true,
})`

const basicHighlighted = computed(() =>
  hlMarkup(basicTemplateCode) + '\n' + hl(basicScriptCode),
)

const basicSchema = computed<FormSchema>(() => ({
  fields: [
    { key: 'username', type: 'input', label: t('schemaForm.demo.username'), placeholder: t('schemaForm.demo.usernamePlaceholder'), tips: t('schemaForm.demo.usernameTips'), onChange: () => { basicChangeCount.value++ } },
    { key: 'role', type: 'select', label: t('schemaForm.demo.role'), options: [
      { label: t('schemaForm.demo.roleAdmin'), value: 'admin' },
      { label: t('schemaForm.demo.roleUser'), value: 'user' },
    ]},
    { key: 'active', type: 'switch', label: t('schemaForm.demo.active') },
  ],
}))
const basicModel = ref<Record<string, unknown>>({ username: 'admin', role: 'admin', active: true })
const basicChangeCount = ref(0)

/* ═══════════════ Grid Demo ═══════════════════════════ */

const gridTemplateCode = `<SchemaForm v-model="formData" :schema="schema" />`

const gridScriptCode = `import type { FormSchema } from 'vuecraft'

const schema: FormSchema = {
  gutter: 16,
  fields: [
    { key: 'firstName', type: 'input', label: 'First Name', col: 12 },
    { key: 'lastName', type: 'input', label: 'Last Name', col: 12 },
    { key: 'email', type: 'input', label: 'Email', col: 24 },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      col: 8,
      props: { min: 0, max: 150 },
    },
    {
      key: 'city',
      type: 'select',
      label: 'City',
      col: 8,
      options: [
        { label: 'Beijing', value: 'beijing' },
        { label: 'Shanghai', value: 'shanghai' },
      ],
    },
    { key: 'rating', type: 'rate', label: 'Rating', col: 8 },
  ],
}`

const gridHighlighted = computed(() =>
  hlMarkup(gridTemplateCode) + '\n' + hl(gridScriptCode),
)

const gridSchema = computed<FormSchema>(() => ({
  gutter: 16,
  fields: [
    { key: 'firstName', type: 'input', label: t('schemaForm.demo.firstName'), col: 12 },
    { key: 'lastName', type: 'input', label: t('schemaForm.demo.lastName'), col: 12 },
    { key: 'email', type: 'input', label: t('schemaForm.demo.email'), col: 24 },
    { key: 'age', type: 'number', label: t('schemaForm.demo.age'), col: 8, props: { min: 0, max: 150 } },
    { key: 'city', type: 'select', label: t('schemaForm.demo.city'), col: 8, options: [
      { label: t('schemaForm.demo.beijing'), value: 'beijing' },
      { label: t('schemaForm.demo.shanghai'), value: 'shanghai' },
    ]},
    { key: 'rating', type: 'rate', label: t('schemaForm.demo.rating'), col: 8 },
  ],
}))
const gridModel = ref<Record<string, unknown>>({})

/* ═══════════════ Conditional Demo ════════════════════ */

const conditionalTemplateCode = `<SchemaForm v-model="formData" :schema="schema" />`

const conditionalScriptCode = `const schema: FormSchema = {
  fields: [
    {
      key: 'hasCompany',
      type: 'switch',
      label: 'Has Company',
    },
    {
      key: 'company',
      type: 'input',
      label: 'Company Name',
      visible: (m) => !!m.hasCompany,
    },
    {
      key: 'level',
      type: 'radio',
      label: 'Member Level',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'VIP', value: 'vip' },
      ],
    },
    {
      key: 'vipCode',
      type: 'input',
      label: 'VIP Code',
      visible: (m) => m.level === 'vip',
      disabled: (m) => !m.hasCompany,
    },
  ],
}`

const conditionalHighlighted = computed(() =>
  hlMarkup(conditionalTemplateCode) + '\n' + hl(conditionalScriptCode),
)

const conditionalSchema = computed<FormSchema>(() => ({
  fields: [
    { key: 'hasCompany', type: 'switch', label: t('schemaForm.demo.hasCompany') },
    { key: 'company', type: 'input', label: t('schemaForm.demo.companyName'), visible: (m) => !!m.hasCompany },
    { key: 'level', type: 'radio', label: t('schemaForm.demo.memberLevel'), options: [
      { label: t('schemaForm.demo.normal'), value: 'normal' },
      { label: t('schemaForm.demo.vip'), value: 'vip' },
    ]},
    { key: 'vipCode', type: 'input', label: t('schemaForm.demo.vipCode'), visible: (m) => m.level === 'vip', disabled: (m) => !m.hasCompany },
  ],
}))
const conditionalModel = ref<Record<string, unknown>>({ level: 'normal' })

/* ═══════════════ Validation Demo ═════════════════════ */

const validationTemplateCode = `<SchemaForm ref="formRef" v-model="formData" :schema="schema" />
<el-button type="primary" @click="handleSubmit">Submit</el-button>
<el-button @click="handleReset">Reset</el-button>`

const validationScriptCode = `import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { SchemaForm } from 'vuecraft'
import type { FormSchema } from 'vuecraft'

const formRef = ref<InstanceType<typeof SchemaForm>>()

const schema: FormSchema = {
  labelWidth: '150px',
  fields: [
    {
      key: 'name',
      type: 'input',
      label: 'Name',
      rules: [
        { required: true, message: 'Please enter your name', trigger: 'blur' },
        { min: 2, max: 20, message: 'Must be 2–20 characters', trigger: 'blur' },
      ],
    },
    {
      key: 'email',
      type: 'input',
      label: 'Email',
      rules: [
        { required: true, message: 'Please enter your email', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
      ],
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      props: { min: 1, max: 120 },
      rules: [
        { required: true, message: 'Please enter your age', trigger: 'blur' },
      ],
    },
    {
      key: 'code',
      type: 'input',
      label: 'Invite Code',
      rules: [
        {
          pattern: /^[A-Z]{2}\\d{4}$/,
          message: 'Format: two uppercase letters + four digits (e.g. AB1234)',
          trigger: 'blur',
        },
      ],
    },
    {
      key: 'confirmName',
      type: 'input',
      label: 'Confirm Name',
      rules: [
        {
          validator: (_rule, value, callback) => {
            if (value !== formData.value.name) {
              callback(new Error('Must match Name field'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
    },
  ],
}

const formData = ref({})

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid) {
    ElMessage.success('Validation passed')
  } else {
    ElMessage.error('Please check the form for errors')
  }
}

function handleReset() {
  formRef.value?.resetFields()
  ElMessage.info('Form has been reset')
}`

const validationHighlighted = computed(() =>
  hlMarkup(validationTemplateCode) + '\n' + hl(validationScriptCode),
)

const validationFormRef = ref<{ validate: () => Promise<boolean>; resetFields: () => void }>()
const validationSchema = computed<FormSchema>(() => ({
  labelWidth: '150px',
  fields: [
    { key: 'name', type: 'input', label: t('schemaForm.demo.name'), rules: [
      { required: true, message: t('schemaForm.demo.nameRequired'), trigger: 'blur' },
      { min: 2, max: 20, message: t('schemaForm.demo.nameLength'), trigger: 'blur' },
    ]},
    { key: 'email', type: 'input', label: t('schemaForm.demo.email'), rules: [
      { required: true, message: t('schemaForm.demo.emailRequired'), trigger: 'blur' },
      { type: 'email', message: t('schemaForm.demo.emailFormat'), trigger: 'blur' },
    ]},
    { key: 'age', type: 'number', label: t('schemaForm.demo.age'), props: { min: 1, max: 120 }, rules: [
      { required: true, message: t('schemaForm.demo.ageRequired'), trigger: 'blur' },
    ]},
    { key: 'code', type: 'input', label: t('schemaForm.demo.inviteCode'), rules: [
      { pattern: /^[A-Z]{2}\d{4}$/, message: t('schemaForm.demo.codeFormat'), trigger: 'blur' },
    ]},
    { key: 'confirmName', type: 'input', label: t('schemaForm.demo.confirmName'), rules: [
      { validator: (_rule, value, callback) => {
        if (value !== validationModel.value.name) {
          callback(new Error(t('schemaForm.demo.mustMatch')))
        } else {
          callback()
        }
      }, trigger: 'blur' },
    ]},
  ],
}))
const validationModel = ref<Record<string, unknown>>({})

async function handleValidate() {
  const valid = await validationFormRef.value?.validate()
  if (valid) {
    ElMessage.success(t('schemaForm.demo.validationSuccess'))
  } else {
    ElMessage.error(t('schemaForm.demo.validationError'))
  }
}

function handleReset() {
  validationFormRef.value?.resetFields()
  ElMessage.info(t('schemaForm.demo.formReset'))
}

/* ═══════════════ Custom Widget Demo ══════════════════ */

const customWidgetTemplateCode = `<SchemaForm
  v-model="formData"
  :schema="schema"
  :custom-widgets="customWidgets"
/>`

const customWidgetScriptCode = `import { h } from 'vue'
import type { CustomWidgetsMap } from 'vuecraft'

const customWidgets: CustomWidgetsMap = {
  // Emoji satisfaction rating
  'emoji-rate': (value, onUpdate) => {
    const emojis = ['😡', '😟', '😐', '😊', '😍']
    return h(
      'div',
      { style: { display: 'flex', gap: '8px' } },
      emojis.map((emoji, i) =>
        h(
          'span',
          {
            key: String(i),
            onClick: () => onUpdate(i + 1),
            style: {
              fontSize: '28px',
              cursor: 'pointer',
              opacity: (value as number ?? 0) > i ? '1' : '0.3',
              transition: 'opacity 0.2s',
              userSelect: 'none',
            },
          },
          emoji,
        ),
      ),
    )
  },

  // Color preset picker
  'color-preset': (value, onUpdate) => {
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899']
    return h(
      'div',
      { style: { display: 'flex', gap: '10px' } },
      colors.map(c =>
        h('div', {
          key: c,
          onClick: () => onUpdate(c),
          style: {
            width: '32px', height: '32px', borderRadius: '50%',
            background: c, cursor: 'pointer',
            border: value === c ? '3px solid #1a1a2e' : '3px solid transparent',
            transition: 'border-color 0.15s',
          },
        }),
      ),
    )
  },
}

const schema: FormSchema = {
  fields: [
    { key: 'product', type: 'input', label: 'Product Name' },
    { key: 'satisfaction', type: 'emoji-rate', label: 'Satisfaction' },
    { key: 'color', type: 'color-preset', label: 'Tag Color' },
  ],
}`

const customWidgetHighlighted = computed(() =>
  hlMarkup(customWidgetTemplateCode) + '\n' + hl(customWidgetScriptCode),
)

const demoWidgets: CustomWidgetsMap = {
  'emoji-rate': (value, onUpdate) => {
    const emojis = ['😡', '😟', '😐', '😊', '😍']
    return h('div', { style: { display: 'flex', gap: '8px' } },
      emojis.map((emoji, i) =>
        h('span', {
          key: String(i),
          onClick: () => onUpdate(i + 1),
          style: {
            fontSize: '28px',
            cursor: 'pointer',
            opacity: (value as number ?? 0) > i ? '1' : '0.3',
            transition: 'opacity 0.2s',
            userSelect: 'none',
          },
        }, emoji),
      ),
    )
  },
  'color-preset': (value, onUpdate) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
    return h('div', { style: { display: 'flex', gap: '10px' } },
      colors.map(c =>
        h('div', {
          key: c,
          onClick: () => onUpdate(c),
          style: {
            width: '32px', height: '32px', borderRadius: '50%',
            background: c, cursor: 'pointer',
            border: value === c ? '3px solid #1a1a2e' : '3px solid transparent',
            transition: 'border-color 0.15s',
          },
        }),
      ),
    )
  },
}
const customWidgets = ref<CustomWidgetsMap>(demoWidgets)
const customWidgetSchema = computed<FormSchema>(() => ({
  fields: [
    { key: 'product', type: 'input', label: t('schemaForm.demo.productName') },
    { key: 'satisfaction', type: 'emoji-rate', label: t('schemaForm.demo.satisfaction') },
    { key: 'color', type: 'color-preset', label: t('schemaForm.demo.tagColor') },
  ],
}))
const customWidgetModel = ref<Record<string, unknown>>({ satisfaction: 3, color: '#3b82f6' })

/* ═══════════════ Slot Override Demo ══════════════════ */

const slotTemplateCode = `<SchemaForm v-model="formData" :schema="schema">
  <template #price-label="{ value, onUpdate }">
    <div style="display:flex;align-items:center;gap:8px">
      <span>¥</span>
      <el-input-number
        :model-value="value"
        placeholder="Enter price"
        :min="0"
        :precision="2"
        controls-position="right"
        @update:model-value="onUpdate"
      />
      <span>CNY</span>
    </div>
  </template>
</SchemaForm>`

const slotScriptCode = `import { ref } from 'vue'
import type { FormSchema } from 'vuecraft'

const schema: FormSchema = {
  fields: [
    { key: 'name', type: 'input', label: 'Product Name' },
    {
      key: 'price',
      type: 'input',
      label: 'Price',
      slot: 'price-label',
      placeholder: 'Enter price',
    },
  ],
}

const formData = ref({ name: '', price: 0 })`

const slotHighlighted = computed(() =>
  hlMarkup(slotTemplateCode) + '\n' + hl(slotScriptCode),
)

const slotSchema = computed<FormSchema>(() => ({
  fields: [
    { key: 'name', type: 'input', label: t('schemaForm.demo.productName') },
    { key: 'price', type: 'input', label: t('schemaForm.demo.price'), slot: 'price-label', placeholder: t('schemaForm.demo.pricePlaceholder') },
  ],
}))
const slotModel = ref<Record<string, unknown>>({ name: '', price: 99.99 })

/* ═══════════════ View Mode Demo ════════════════════ */

const viewMode = ref<'edit' | 'view'>('view')

const viewModeTemplateCode = `<SchemaForm v-model="formData" :schema="schema" />`

const viewModeScriptCode = `import { ref, computed } from 'vue'
import { SchemaForm } from 'vuecraft'
import type { FormSchema } from 'vuecraft'

const isView = ref(true)

const schema = computed<FormSchema>(() => ({
  mode: isView.value ? 'view' : 'edit',
  fields: [
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      key: 'tags',
      type: 'checkbox',
      label: 'Tags',
      options: [
        { label: 'Frontend', value: 'fe' },
        { label: 'Backend', value: 'be' },
        { label: 'DevOps', value: 'ops' },
      ],
    },
    { key: 'enabled', type: 'switch', label: 'Active' },
    { key: 'priority', type: 'rate', label: 'Priority' },
    { key: 'deadline', type: 'date-picker', label: 'Deadline' },
    { key: 'theme', type: 'color-picker', label: 'Theme Color' },
    { key: 'note', type: 'textarea', label: 'Note' },
  ],
}))`

const viewModeHighlighted = computed(() =>
  hlMarkup(viewModeTemplateCode) + '\n' + hl(viewModeScriptCode),
)

const viewModeSchema = computed<FormSchema>(() => ({
  mode: viewMode.value,
  fields: [
    {
      key: 'status',
      type: 'select',
      label: t('schemaForm.demo.role'),
      options: [
        { label: t('schemaForm.demo.roleAdmin'), value: 'active' },
        { label: t('schemaForm.demo.roleUser'), value: 'inactive' },
      ],
    },
    {
      key: 'tags',
      type: 'checkbox',
      label: t('schemaForm.demo.tags'),
      options: [
        { label: t('schemaForm.demo.frontend'), value: 'fe' },
        { label: t('schemaForm.demo.backend'), value: 'be' },
        { label: t('schemaForm.demo.devops'), value: 'ops' },
      ],
    },
    { key: 'enabled', type: 'switch', label: t('schemaForm.demo.active') },
    { key: 'priority', type: 'rate', label: t('schemaForm.demo.satisfaction') },
    { key: 'deadline', type: 'date-picker', label: t('schemaForm.demo.deadline') },
    { key: 'theme', type: 'color-picker', label: t('schemaForm.demo.themeColor') },
    { key: 'note', type: 'textarea', label: t('schemaForm.demo.note') },
  ],
}))
const viewModeModel = ref<Record<string, unknown>>({
  status: 'active',
  tags: ['fe', 'be'],
  enabled: true,
  priority: 4,
  deadline: '2026-06-30',
  theme: '#409eff',
  note: 'Review the design system before release.',
})

/* ═══════════════ Form Display Demo ════════════════════ */

const displaySize = ref<'large' | 'default' | 'small'>('default')
const displayLabelPos = ref<'left' | 'right' | 'top'>('left')
const displayInline = ref(false)

const displayTemplateCode = `<SchemaForm v-model="formData" :schema="schema" />`

const displayScriptCode = `const schema: FormSchema = {
  size: 'default',          // 'large' | 'default' | 'small'
  labelPosition: 'left',    // 'left' | 'right' | 'top'
  inline: false,            // set true for inline filter-bar forms
  fields: [
    { key: 'name', type: 'input', label: 'Name' },
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
    },
  ],
}`

const displayHighlighted = computed(() =>
  hlMarkup(displayTemplateCode) + '\n' + hl(displayScriptCode),
)

const displaySchema = computed<FormSchema>(() => ({
  size: displaySize.value,
  labelPosition: displayLabelPos.value,
  inline: displayInline.value,
  fields: [
    { key: 'name', type: 'input', label: t('schemaForm.demo.username') },
    { key: 'status', type: 'select', label: t('schemaForm.demo.role'), options: [
      { label: t('schemaForm.demo.roleAdmin'), value: 1 },
      { label: t('schemaForm.demo.roleUser'), value: 0 },
    ]},
  ],
}))
const displayModel = ref<Record<string, unknown>>({ name: 'VueCraft', status: 1 })

/* ═══════════════ Raw codes for copy ══════════════════ */

rawCodes.basic = basicTemplateCode + '\n' + basicScriptCode
rawCodes.grid = gridTemplateCode + '\n' + gridScriptCode
rawCodes.conditional = conditionalTemplateCode + '\n' + conditionalScriptCode
rawCodes.validation = validationTemplateCode + '\n' + validationScriptCode
rawCodes.customWidget = customWidgetTemplateCode + '\n' + customWidgetScriptCode
rawCodes.slot = slotTemplateCode + '\n' + slotScriptCode
rawCodes.display = displayTemplateCode + '\n' + displayScriptCode
rawCodes.viewMode = viewModeTemplateCode + '\n' + viewModeScriptCode

/* ═══════════════ API Tables ══════════════════════════ */

const propsTable = computed(() => [
  { name: 'schema', type: 'FormSchema', default: '—', desc: t('schemaForm.table.schema') },
  { name: 'modelValue', type: 'Record<string, unknown>', default: '{}', desc: t('schemaForm.table.modelValue') },
  { name: 'customWidgets', type: 'CustomWidgetsMap', default: '{}', desc: t('schemaForm.table.customWidgets') },
  { name: 'schema.disabled', type: 'boolean', default: 'false', desc: t('schemaForm.table.schemaDisabled') },
])
const formSchemaTable = computed(() => [
  { name: 'fields', type: 'FieldConfig[]', default: '—', desc: t('schemaForm.table.formFields') },
  { name: 'labelWidth', type: 'string', default: "'100px'", desc: t('schemaForm.table.formLabelWidth') },
  { name: 'labelPosition', type: "'left' | 'right' | 'top'", default: "'left'", desc: t('schemaForm.table.formLabelPos') },
  { name: 'size', type: "'large' | 'default' | 'small'", default: "'default'", desc: t('schemaForm.table.formSize') },
  { name: 'gutter', type: 'number', default: '—', desc: t('schemaForm.table.formGutter') },
  { name: 'inline', type: 'boolean', default: 'false', desc: t('schemaForm.table.formInline') },
  { name: 'disabled', type: 'boolean', default: 'false', desc: t('schemaForm.table.formDisabled') },
])
const eventsTable = computed(() => [
  { name: 'update:modelValue', params: '(value: Record<string, unknown>)', desc: t('schemaForm.table.updateEvent') },
  { name: 'submit', params: '—', desc: t('schemaForm.table.submitEvent') },
  { name: 'reset', params: '—', desc: t('schemaForm.table.resetEvent') },
])
const methodsTable = computed(() => [
  { name: 'validate()', returns: 'Promise<boolean>', desc: t('schemaForm.table.validateReturns') },
  { name: 'resetFields()', returns: 'void', desc: t('schemaForm.table.resetReturns') },
  { name: 'elFormRef', returns: 'FormInstance', desc: t('schemaForm.table.elFormRefReturns') },
])
const fieldConfigTable = computed(() => [
  { name: 'key', type: 'string', default: '—', desc: t('schemaForm.table.fieldKey') },
  { name: 'type', type: 'FieldType', default: '—', desc: t('schemaForm.table.fieldType') },
  { name: 'label', type: 'string', default: '—', desc: t('schemaForm.table.fieldLabel') },
  { name: 'placeholder', type: 'string', default: '—', desc: t('schemaForm.table.fieldPlaceholder') },
  { name: 'defaultValue', type: 'unknown', default: '—', desc: t('schemaForm.table.fieldDefault') },
  { name: 'options', type: 'SelectOption[]', default: '—', desc: t('schemaForm.table.fieldOptions') },
  { name: 'rules', type: 'FormItemRule[]', default: '—', desc: t('schemaForm.table.fieldRules') },
  { name: 'props', type: 'Record<string, unknown>', default: '—', desc: t('schemaForm.table.fieldProps') },
  { name: 'col', type: 'number (1–24)', default: '—', desc: t('schemaForm.table.fieldCol') },
  { name: 'visible', type: 'boolean | ((m) => boolean)', default: 'true', desc: t('schemaForm.table.fieldVisible') },
  { name: 'disabled', type: 'boolean | ((m) => boolean)', default: 'false', desc: t('schemaForm.table.fieldDisabled') },
  { name: 'readonly', type: 'boolean | ((m) => boolean)', default: 'false', desc: t('schemaForm.table.fieldReadonly') },
  { name: 'onChange', type: '(value, model) => void', default: '—', desc: t('schemaForm.table.fieldOnChange') },
  { name: 'tips', type: 'string', default: '—', desc: t('schemaForm.table.fieldTips') },
  { name: 'slot', type: 'string', default: '—', desc: t('schemaForm.table.fieldSlot') },
])
</script>

<style scoped>
/* ═══════════════ Page Layout ═══════════════════════ */

.doc-layout {
  display: flex;
  gap: 52px;
  align-items: flex-start;
}

.doc-page {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 44px;
  padding-bottom: 60px;
  max-width: 780px;
}

.doc-hero {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 30px;
  font-weight: 780;
  letter-spacing: -0.8px;
  color: var(--c-text);
  margin: 0;
}

.doc-desc {
  font-size: 14px;
  color: #1a1a2e;
  line-height: 1.7;
  margin: 0;
  max-width: 600px;
}

/* ═══════════════ Section ═════════════════════════════ */

.sf-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sf-section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: var(--c-text);
  margin: 0;
  letter-spacing: -0.3px;
}

.sf-section-desc {
  font-size: 14px;
  color: #1a1a2e;
  line-height: 1.65;
  margin: 0;
}

.sf-section-desc code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  background: #eef0f4;
  color: #409eff;
  padding: 1.5px 7px;
  border-radius: 4px;
  font-weight: 700;
}

/* ═══════════════ Demo Card ═══════════════════════════ */

.sf-demo-card {
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--c-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.sf-demo-preview {
  padding: 28px 32px;
  background: #fafbfc;
}

.sf-demo-divider {
  height: 1px;
  background: var(--c-border);
}

.sf-demo-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

/* ── onChange hint ──────────────────────────────────── */

.sf-onchange-hint {
  margin-top: 10px;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

/* ── Display controls ───────────────────────────────── */

.sf-display-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.sf-display-controls__gap {
  margin-left: 4px;
}

/* ═══════════════ Code Toggle ═════════════════════════ */

.sf-demo-code__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #fafbfc;
  cursor: pointer;
  font-size: 14px;
  color: #8b8fa3;
  user-select: none;
  transition: color 0.15s, background 0.15s;
}

.sf-demo-code__toggle:hover {
  color: #1a1a2e;
  background: #f0f1f3;
}

.sf-demo-code__toggle-icon {
  font-size: 10px;
  flex-shrink: 0;
}

/* ═══════════════ Slot Demo ═══════════════════════════ */

.sf-slot-demo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sf-slot-demo__prefix,
.sf-slot-demo__suffix {
  font-size: 14px;
  font-weight: 600;
  color: #8b8fa3;
}

/* ═══════════════ Code Block ══════════════════════════ */

.sf-demo-code {
  background: #fafbfc;
  position: relative;
}

.sf-demo-code__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f0f1f3;
  border-bottom: 1px solid var(--c-border);
}

.sf-demo-code__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5f57;
  box-shadow:
    18px 0 0 #febc2e,
    36px 0 0 #28c840;
}

.sf-demo-code__lang {
  margin-left: 38px;
  font-size: 14px;
  font-weight: 600;
  color: #8b8fa3;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.sf-demo-code__copy {
  margin-left: auto;
  padding: 3px 10px;
  font-size: 14px;
  font-weight: 500;
  color: #8b8fa3;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s;
  font-family: inherit;
}

.sf-demo-code__copy:hover {
  color: #1a1a2e;
}

.code-block {
  margin: 0;
  padding: 18px 22px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.75;
  color: #1a1a2e;
  white-space: pre;
  tab-size: 2;
  -moz-tab-size: 2;
}

/* ═══════════════ Prism Token Colors (light theme) ════ */

.code-block :deep(.token.comment),
.code-block :deep(.token.prolog),
.code-block :deep(.token.doctype),
.code-block :deep(.token.cdata) {
  color: #8b949e;
  font-style: italic;
}

.code-block :deep(.token.punctuation) {
  color: #484f58;
}

.code-block :deep(.token.property),
.code-block :deep(.token.tag),
.code-block :deep(.token.boolean),
.code-block :deep(.token.number),
.code-block :deep(.token.constant),
.code-block :deep(.token.symbol),
.code-block :deep(.token.deleted) {
  color: #0550ae;
}

.code-block :deep(.token.selector),
.code-block :deep(.token.attr-name),
.code-block :deep(.token.string),
.code-block :deep(.token.char),
.code-block :deep(.token.builtin),
.code-block :deep(.token.inserted) {
  color: #0a3069;
}

.code-block :deep(.token.operator),
.code-block :deep(.token.entity),
.code-block :deep(.token.url) {
  color: #0550ae;
}

.code-block :deep(.token.atrule),
.code-block :deep(.token.attr-value),
.code-block :deep(.token.keyword) {
  color: #cf222e;
}

.code-block :deep(.token.function),
.code-block :deep(.token.class-name) {
  color: #8250df;
}

.code-block :deep(.token.regex),
.code-block :deep(.token.important),
.code-block :deep(.token.variable) {
  color: #953800;
}

.code-block :deep(.token.important),
.code-block :deep(.token.bold) {
  font-weight: 600;
}

.code-block :deep(.token.italic) {
  font-style: italic;
}

/* ═══════════════ API Tables ═════════════════════════ */

.sf-subtitle {
  font-size: 16px;
  font-weight: 650;
  color: var(--c-text);
  margin: 20px 0 10px;
  letter-spacing: -0.2px;
}

.sf-subtitle:first-of-type {
  margin-top: 4px;
}

.sf-api-table {
  font-size: 14px;
  table-layout: auto;
}

.sf-api-table :deep(th) {
  font-weight: 600;
  color: var(--c-text);
  background: #f5f6f8;
  text-align: left;
  padding: 10px 14px;
}

.sf-api-table :deep(td) {
  color: #1a1a2e;
  padding: 9px 14px;
  vertical-align: middle;
}

.sf-api-table :deep(td:first-child) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  color: #409eff;
  font-weight: 700;
}

.sf-api-table :deep(td:nth-child(3)) {
  text-align: center;
  color: #1a1a2e;
  font-size: 14px;
}

/* ═══════════════ TOC Sidebar ═════════════════════════ */

.doc-toc {
  position: sticky;
  top: 28px;
  width: 156px;
  flex-shrink: 0;
  padding-left: 60px;
  border-left: 1px solid var(--c-border);
}

.doc-toc__title {
  font-size: 14px;
  font-weight: 600;
  color: #8b8fa3;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 12px;
}

.doc-toc__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doc-toc__link {
  display: block;
  font-size: 14px;
  color: #8b8fa3;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.15s;
  padding: 2px 0;
}

.doc-toc__link:hover {
  color: #1a1a2e;
}

.doc-toc__item.is-active .doc-toc__link {
  color: #409eff;
  font-weight: 600;
}
</style>
