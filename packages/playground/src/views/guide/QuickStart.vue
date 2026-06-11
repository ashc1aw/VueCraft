<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
        <h1 class="doc-title">{{ t('guide.quickStart.title') }}</h1>
        <p class="doc-desc">{{ t('guide.quickStart.desc') }}</p>
      </div>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.quickStart.firstTitle') }}</h2>
        <p class="sf-section-desc">{{ t('guide.quickStart.firstDesc') }}</p>
        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode">
                {{ copied ? t('guide.quickStart.copied') : t('guide.quickStart.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="highlighted" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'

const { t } = useI18n()

const templateCode = `<template>
  <div>
    <SearchBar
      v-model="params"
      :fields="searchFields"
      search-text="Search"
      reset-text="Reset"
      @search="onSearch"
    />
    <TablePro :columns="columns" :data="tableData" />
  </div>
</template>`

const scriptCode = `<script setup lang="ts">
import { ref } from 'vue'
import { SearchBar, TablePro } from 'vuecraft'
import type { SearchField, TableColumn } from 'vuecraft'

const searchFields: SearchField[] = [
  { key: 'keyword', type: 'input', label: 'Keyword' },
]

const columns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name' },
]

const tableData = ref([])

function onSearch(params: Record<string, unknown>) {
  // fetch data with search params
}
<\/script>`

function hlMarkup(code: string) { return Prism.highlight(code.trim(), Prism.languages.markup!, 'markup') }
function hl(code: string) { return Prism.highlight(code.trim(), Prism.languages.typescript!, 'typescript') }

const highlighted = computed(() => hlMarkup(templateCode) + '\n' + hl(scriptCode))

const rawCode = templateCode + '\n' + scriptCode
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function copyCode() {
  try { await navigator.clipboard.writeText(rawCode) } catch {
    const ta = document.createElement('textarea'); ta.value = rawCode; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
  }
  copied.value = true; if (copyTimer) clearTimeout(copyTimer); copyTimer = setTimeout(() => (copied.value = false), 2000)
}
</script>

<style scoped>
.doc-layout { display: flex; gap: 52px; align-items: flex-start; }
.doc-page { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 36px; padding-bottom: 60px; max-width: 780px; }

.doc-hero { display: flex; flex-direction: column; gap: 10px; }
.doc-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 30px; font-weight: 780; letter-spacing: -0.8px; color: #1a1a2e; margin: 0; }
.doc-desc { font-size: 14px; color: #606780; line-height: 1.7; margin: 0; max-width: 640px; }

.sf-section { display: flex; flex-direction: column; gap: 10px; }
.sf-section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a2e; margin: 0; letter-spacing: -0.3px; }
.sf-section-desc { font-size: 14px; color: #606780; line-height: 1.65; margin: 0; }

.sf-demo-card { border: 1px solid #ebedf0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
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
.code-block :deep(.token.tag) { color: #22863a; }
.code-block :deep(.token.attr-name) { color: #6f42c1; }
</style>
