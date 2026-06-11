<template>
  <div class="sf-page">
    <header class="sf-header">
      <h1 class="sf-title">{{ t('guide.design.title') }}</h1>
      <p class="sf-desc">{{ t('guide.design.desc') }}</p>
    </header>

    <!-- 为什么 -->
    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.design.whyTitle') }}</h2>
      <p class="sf-section-desc">{{ t('guide.design.whyDesc') }}</p>
      <div class="pain-list">
        <div v-for="item in painItems" :key="item.icon" class="pain-card">
          <div class="pain-icon">{{ item.icon }}</div>
          <p class="pain-text">{{ item.text }}</p>
        </div>
      </div>
      <p class="solution-text">{{ t('guide.design.solutionText') }}</p>
    </section>

    <!-- 设计原则 -->
    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.design.principleTitle') }}</h2>
      <div class="principle-grid">
        <div v-for="p in principles" :key="p.emoji" class="principle-card">
          <span class="principle-emoji">{{ p.emoji }}</span>
          <h4 class="principle-name">{{ p.name }}</h4>
          <p class="principle-desc">{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 规范 -->
    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.design.ruleTitle') }}</h2>
      <div class="rule-list">
        <div v-for="(r, i) in rules" :key="i" class="rule-item">
          <span class="rule-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="rule-body">
            <h4 class="rule-name">{{ r.name }}</h4>
            <p class="rule-desc">{{ r.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 不做的事 -->
    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.design.dontTitle') }}</h2>
      <ul class="dont-list">
        <li v-for="(item, i) in dontList" :key="i">{{ item }}</li>
      </ul>
    </section>

    <!-- 技术栈 -->
    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.design.techTitle') }}</h2>
      <table class="tech-table">
        <thead><tr><th>{{ techTableHeader[0] }}</th><th>{{ techTableHeader[1] }}</th></tr></thead>
        <tbody>
          <tr v-for="(row, i) in techTableRows" :key="i"><td>{{ row[0] }}</td><td>{{ row[1] }}</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const painItems = computed(() => {
  const val = tm('guide.design.painItems')
  return Array.isArray(val) ? val : []
})

const principles = computed(() => {
  const val = tm('guide.design.principles')
  return Array.isArray(val) ? val : []
})

const rules = computed(() => {
  const val = tm('guide.design.rules')
  return Array.isArray(val) ? val : []
})

const dontList = computed(() => {
  const val = tm('guide.design.dontList')
  return Array.isArray(val) ? val : []
})

const techTableHeader = computed(() => {
  const val = tm('guide.design.techTable')
  return Array.isArray(val) && val.length > 0 && Array.isArray(val[0]) ? val[0] : ['', '']
})

const techTableRows = computed(() => {
  const val = tm('guide.design.techTable')
  if (!Array.isArray(val)) return []
  return val.slice(1)
})
</script>

<style scoped>
.sf-page { display: flex; flex-direction: column; gap: 40px; padding-bottom: 60px; max-width: 780px; }
.sf-header { padding: 0 0 4px; display: flex; flex-direction: column; gap: 10px; }
.sf-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 30px; font-weight: 780; letter-spacing: -0.8px; color: #1a1a2e; margin: 0; }
.sf-desc { font-size: 14px; color: #606780; max-width: 640px; line-height: 1.7; margin: 0; }
.sf-section { display: flex; flex-direction: column; gap: 10px; }
.sf-section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; font-weight: 700; color: #1a1a2e; margin: 0; letter-spacing: -0.3px; }
.sf-section-desc { font-size: 14px; color: #606780; line-height: 1.65; margin: 0; }

.pain-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; margin-top: 6px; }
.pain-card { padding: 16px; border: 1px solid #ebedf0; border-radius: 10px; background: #fff; transition: box-shadow .15s, border-color .15s; }
.pain-card:hover { box-shadow: 0 1px 3px rgba(0,0,0,.03); border-color: #c0c4cc; }
.pain-icon { font-size: 22px; margin-bottom: 8px; }
.pain-text { font-size: 13px; color: #606780; line-height: 1.55; margin: 0; }

.solution-text { font-size: 14px; color: #1a1a2e; font-weight: 600; line-height: 1.65; margin: 4px 0 0; padding: 16px 20px; background: rgba(64,158,255,.06); border-left: 3px solid #409eff; border-radius: 0 10px 10px 0; }

.principle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.principle-card { padding: 24px 20px; border: 1px solid #ebedf0; border-radius: 14px; background: #fff; text-align: center; transition: transform .2s, box-shadow .2s; }
.principle-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,.08); }
.principle-emoji { font-size: 32px; display: block; margin-bottom: 10px; }
.principle-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 6px; letter-spacing: -.2px; }
.principle-desc { font-size: 12.5px; color: #606780; line-height: 1.55; margin: 0; }

.rule-list { display: flex; flex-direction: column; gap: 10px; }
.rule-item { display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px; border: 1px solid #ebedf0; border-radius: 12px; background: #fff; transition: box-shadow .15s; }
.rule-item:hover { box-shadow: 0 1px 3px rgba(0,0,0,.03); }
.rule-num { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; color: #409eff; opacity: .25; line-height: 1; min-width: 32px; text-align: center; }
.rule-body { flex: 1; min-width: 0; }
.rule-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; letter-spacing: -.2px; }
.rule-desc { font-size: 13px; color: #606780; line-height: 1.55; margin: 0; }

.dont-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.dont-list li { position: relative; padding-left: 24px; font-size: 13.5px; color: #606780; line-height: 1.55; }
.dont-list li::before { content: ''; position: absolute; left: 0; top: 9px; width: 7px; height: 7px; border-radius: 50%; background: #ef4444; opacity: .45; }

.tech-table { width: 100%; max-width: 520px; border-collapse: collapse; font-size: 13.5px; }
.tech-table th { text-align: left; padding: 11px 16px; background: #409eff; color: #fff; font-weight: 700; font-size: 12.5px; border-radius: 10px 10px 0 0; }
.tech-table td { padding: 10px 16px; color: #303133; border-bottom: 1px solid #ebedf0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.tech-table tr:last-child td { border-bottom: none; }

@media (max-width: 650px) {
  .pain-list { grid-template-columns: 1fr; }
  .principle-grid { grid-template-columns: 1fr 1fr; }
}
</style>
