<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
        <h1 class="doc-title">{{ t('guide.i18n.title') }}</h1>
        <p class="doc-desc">{{ t('guide.i18n.desc') }}</p>
      </div>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.i18n.switchTitle') }}</h2>
        <p class="sf-section-desc" v-html="t('guide.i18n.switchDesc')" />
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.i18n.addLangTitle') }}</h2>
        <p class="sf-section-desc">{{ t('guide.i18n.addLangDesc') }}</p>

        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">locales/ja.ts</span>
              <button class="sf-demo-code__copy" @click="copyCode('ja')">
                {{ copied === 'ja' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" v-html="jaHighlighted" />
          </div>
        </div>

        <div class="sf-demo-card" style="margin-top: 12px;">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">i18n.ts</span>
              <button class="sf-demo-code__copy" @click="copyCode('i18n')">
                {{ copied === 'i18n' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" v-html="i18nHighlighted" />
          </div>
        </div>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.i18n.structTitle') }}</h2>
        <p class="sf-section-desc" v-html="t('guide.i18n.structDesc')" />

        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">zh.ts</span>
              <button class="sf-demo-code__copy" @click="copyCode('struct')">
                {{ copied === 'struct' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" v-html="structHighlighted" />
          </div>
        </div>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.i18n.usageTitle') }}</h2>
        <p class="sf-section-desc" v-html="t('guide.i18n.usageDesc')" />

        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">Vue SFC</span>
              <button class="sf-demo-code__copy" @click="copyCode('usage')">
                {{ copied === 'usage' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block" v-html="usageHighlighted" />
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

function hl(code: string) { return Prism.highlight(code.trim(), Prism.languages.typescript!, 'typescript') }
function hlMarkup(code: string) { return Prism.highlight(code.trim(), Prism.languages.markup!, 'markup') }

/* ═══════════════ Code snippets ═══════════════════ */

const jaCode = `// locales/ja.ts
export default {
  nav: { home: 'ホーム', components: 'コンポーネント' },
  sidebar: { form: 'フォーム', table: 'テーブル' },
  schemaForm: { title: 'スキーマフォーム', desc: '...' },
}`

const i18nCode = `// i18n.ts
// ${t('guide.i18n.addLangHint1')}
// ${t('guide.i18n.addLangHint2')}`

const structCode = `export default {
  // 导航
  nav: { home: '首页', components: '组件' },

  // 侧边栏
  sidebar: { form: '表单', table: '表格' },

  // 分组
  groups: { common: '通用', data: '数据展示' },

  // 每个组件一个顶级 key
  schemaForm: { title: 'SchemaForm 动态表单', desc: '...' },
  searchBar:  { title: 'SearchBar 查询表单', desc: '...' },
}`

const usageCode = `<template>
  <SchemaForm
    :schema="{ fields: [{ key: 'name', label: t('form.name'), type: 'input' }] }"
  />
</template>

<!-- ${t('guide.i18n.correctHint')} -->
<!-- ${t('guide.i18n.schemaHint')} -->`

/* ═══════════════ Highlighted ═══════════════════ */

const jaHighlighted = computed(() => hl(jaCode))
const i18nHighlighted = computed(() => hl(i18nCode))
const structHighlighted = computed(() => hl(structCode))
const usageHighlighted = computed(() => hlMarkup(usageCode))

const rawCodes: Record<string, string> = {
  ja: jaCode,
  i18n: i18nCode,
  struct: structCode,
  usage: usageCode,
}

const copied = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function copyCode(key: string) {
  const code = rawCodes[key]; if (!code) return
  try { await navigator.clipboard.writeText(code) } catch {
    const ta = document.createElement('textarea'); ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
  }
  copied.value = key; if (copyTimer) clearTimeout(copyTimer); copyTimer = setTimeout(() => (copied.value = null), 2000)
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
.sf-section-desc :deep(code) { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #eef0f4; color: #409eff; padding: 1.5px 7px; border-radius: 4px; font-weight: 700; }

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
