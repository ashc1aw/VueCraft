<template>
  <div class="doc-layout">
    <div class="doc-page">
      <div class="doc-hero">
        <h1 class="doc-title">{{ t('guide.install.title') }}</h1>
        <p class="doc-desc">{{ t('guide.install.desc') }}</p>
      </div>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.install.prereqTitle') }}</h2>
        <ul class="sf-list">
          <li v-for="item in prereqs" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.install.installTitle') }}</h2>
        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">Shell</span>
              <button class="sf-demo-code__copy" @click="copyCode('install')">
                {{ copied === 'install' ? t('guide.install.copied') : t('guide.install.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="installHighlighted" />
          </div>
        </div>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.install.globalTitle') }}</h2>
        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">TypeScript</span>
              <button class="sf-demo-code__copy" @click="copyCode('global')">
                {{ copied === 'global' ? t('guide.install.copied') : t('guide.install.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="globalHighlighted" />
          </div>
        </div>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('guide.install.onDemandTitle') }}</h2>
        <div class="sf-demo-card">
          <div class="sf-demo-code">
            <div class="sf-demo-code__header">
              <span class="sf-demo-code__dot" />
              <span class="sf-demo-code__lang">TypeScript</span>
              <button class="sf-demo-code__copy" @click="copyCode('onDemand')">
                {{ copied === 'onDemand' ? t('guide.install.copied') : t('guide.install.copy') }}
              </button>
            </div>
            <pre class="code-block" v-html="onDemandHighlighted" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'

const { t, tm } = useI18n()

const prereqs = computed(() => {
  const val = tm('guide.install.prereqs')
  return Array.isArray(val) ? val : []
})

const installCode = 'pnpm add vuecraft element-plus'

const globalCode = `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCraft from 'vuecraft'
import 'vuecraft/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(VueCraft)
app.mount('#app')`

const onDemandCode = `import { SearchBar, TablePro, TreeTransfer } from 'vuecraft'
import 'vuecraft/dist/style.css'`

function hl(code: string, lang: 'typescript' | 'bash' = 'typescript') {
  return Prism.highlight(code.trim(), Prism.languages[lang]!, lang)
}

const installHighlighted = computed(() => hl(installCode, 'bash'))
const globalHighlighted = computed(() => hl(globalCode))
const onDemandHighlighted = computed(() => hl(onDemandCode))

const rawCodes: Record<string, string> = {
  install: installCode,
  global: globalCode,
  onDemand: onDemandCode,
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

.sf-list { list-style: disc; padding-left: 22px; color: #606780; font-size: 14px; line-height: 2.2; margin: 0; }

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
.code-block :deep(.token.operator) { color: #cf222e; }
</style>
