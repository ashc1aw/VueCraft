<template>
  <div class="sf-page">
    <header class="sf-header">
      <h1 class="sf-title">{{ t('guide.changelog.title') }}</h1>
      <p class="sf-desc">{{ t('guide.changelog.desc') }}</p>
    </header>

    <div class="sf-version-card">
      <div class="version-header">
        <span class="version-tag">v1.0.0</span>
        <span class="version-badge">{{ t('guide.changelog.stable') }}</span>
        <span class="version-date">2026-06</span>
      </div>
      <p class="version-desc">{{ t('guide.changelog.versionDesc') }}</p>

      <div class="change-group">
        <h3 class="change-title">🎉 {{ t('guide.changelog.newComponentsTitle') }}</h3>
        <ul class="change-list">
          <li v-for="(item, i) in newComponents" :key="i">{{ item }}</li>
        </ul>
      </div>

      <div class="change-group">
        <h3 class="change-title">🏗 {{ t('guide.changelog.infraTitle') }}</h3>
        <ul class="change-list">
          <li v-for="(item, i) in infraItems" :key="i">{{ item }}</li>
        </ul>
      </div>

      <div class="change-group">
        <h3 class="change-title">📋 {{ t('guide.changelog.todoTitle') }}</h3>
        <ul class="change-list">
          <li v-for="(item, i) in todoItems" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>

    <section class="sf-section">
      <h2 class="sf-section-title">{{ t('guide.changelog.versionSpecTitle') }}</h2>
      <p class="sf-section-desc" v-html="t('guide.changelog.versionSpecDesc')" />

      <div class="sf-demo-block">
        <table class="spec-table">
          <thead>
            <tr><th>{{ specTableHeader[0] }}</th><th>{{ specTableHeader[1] }}</th><th>{{ specTableHeader[2] }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in specTableRows" :key="i"><td><code>{{ row[0] }}</code></td><td><code>{{ row[1] }}</code></td><td>{{ row[2] }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const newComponents = computed(() => {
  const val = tm('guide.changelog.newComponents')
  return Array.isArray(val) ? val : []
})

const infraItems = computed(() => {
  const val = tm('guide.changelog.infraItems')
  return Array.isArray(val) ? val : []
})

const todoItems = computed(() => {
  const val = tm('guide.changelog.todoItems')
  return Array.isArray(val) ? val : []
})

const specTableHeader = computed(() => {
  const val = tm('guide.changelog.specTableHeader')
  return Array.isArray(val) ? val : ['', '', '']
})

const specTableRows = computed(() => {
  const val = tm('guide.changelog.specTableRows')
  if (!Array.isArray(val)) return []
  return val
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
.sf-section-desc code { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #f5f6f8; color: #409eff; padding: 2px 7px; border-radius: 4px; }

.sf-version-card { padding: 28px; border: 1px solid #ebedf0; border-radius: 16px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.03); display: flex; flex-direction: column; gap: 20px; }
.version-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.version-tag { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
.version-badge { font-size: 11px; font-weight: 700; color: #fff; background: #409eff; padding: 3px 9px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.8px; }
.version-date { font-size: 13px; color: #606780; margin-left: auto; }
.version-desc { font-size: 14px; color: #606780; line-height: 1.65; margin: 0; }

.change-group { display: flex; flex-direction: column; gap: 8px; }
.change-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; font-weight: 700; color: #1a1a2e; margin: 0; letter-spacing: -0.15px; }
.change-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.change-list li { position: relative; padding-left: 20px; font-size: 13.5px; color: #606780; line-height: 1.55; }
.change-list li::before { content: ''; position: absolute; left: 0; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: #409eff; opacity: .55; }

.sf-demo-block { border: 1px solid #ebedf0; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.03); }
.spec-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.spec-table th { text-align: left; padding: 12px 16px; background: #fafbfc; color: #606780; font-weight: 600; font-size: 12.5px; border-bottom: 1px solid #ebedf0; white-space: nowrap; }
.spec-table td { padding: 12px 16px; color: #303133; border-bottom: 1px solid #ebedf0; }
.spec-table td code { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #f5f6f8; color: #409eff; padding: 2px 7px; border-radius: 4px; }
</style>
