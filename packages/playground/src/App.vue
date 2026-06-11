<template>
  <el-config-provider :locale="epLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const { locale } = useI18n()

const epLocale = computed(() => (locale.value === 'zh' ? zhCn : en))
</script>

<style>
/* ═══════════════════ Reset ═══════════════════════════ */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  font-size: 14px;
  color: #1a1a2e;
  background: #f8fafc;
}

/* ═══════════════════ Scrollbar ═══════════════════════ */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.18);
}

/* ═══════════════════ Design Tokens ═══════════════════ */
:root {
  --c-bg: #f8fafc;
  --c-surface: #ffffff;
  --c-border: #ebedf0;
  --c-text: #1a1a2e;
  --c-text-sec: #606780;
  --c-primary: #409eff;
}
</style>
