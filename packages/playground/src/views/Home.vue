<template>
  <div class="home">
    <!-- Ambient background -->
    <div class="bg-ambient">
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
      <div class="bg-grid" />
    </div>

    <!-- Header -->
    <Header>
      <router-link
        v-for="nav in topNavs"
        :key="nav.key"
        :to="nav.path"
        class="home__nav-link"
        :class="{ active: currentNav === nav.key }"
      >
        {{ nav.label }}
      </router-link>

      <template #actions>
        <button class="home__icon-btn" :title="t('header.switchLocale')" @click="switchLocale">
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span class="home__locale-label">{{ locale === 'zh' ? '中' : 'EN' }}</span>
        </button>
        <a
          href="https://github.com/ashc1aw/VueCraft"
          class="home__icon-btn"
          target="_blank"
          aria-label="GitHub"
          :title="t('header.githubAria')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </template>
    </Header>

    <!-- Body -->
    <div class="home__body">
      <Sidebar
        :menu-groups="visibleGroups"
        :router-instance="router"
      />

      <main class="home__content">
        <div class="home__content-inner">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import { menuGroups } from '../menuConfig'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

// ── 顶部导航 ──────────────────────────────────────────
const topNavs = computed(() => [
  { key: 'guide', label: t('nav.guide'), path: '/guide/install' },
  { key: 'components', label: t('nav.components'), path: '/components/schema-form' },
])

const currentNav = computed<'guide' | 'components'>(() => {
  return route.path.startsWith('/guide') ? 'guide' : 'components'
})

const visibleGroups = computed(() => {
  return menuGroups.filter((g) => g.nav === currentNav.value)
})

// ── 语言切换 ──────────────────────────────────────────
function switchLocale() {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('vuecraft-locale', next)
}
</script>

<style scoped>
/* ═══════════════════ Layout ══════════════════════════ */
.home {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
}

.home__body {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 1340px;
  margin: 0 auto;
  height: calc(100vh - 60px);
  margin-top: 60px;
}

/* ═══════════════════ Ambient Background ══════════════ */
.bg-ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #409eff, transparent 70%);
  top: -200px;
  right: -150px;
  animation: orbDrift 16s ease-in-out infinite alternate;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #409eff, transparent 70%);
  bottom: -100px;
  left: -100px;
  animation: orbDrift 20s ease-in-out infinite alternate-reverse;
}

@keyframes orbDrift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(40px, -30px) scale(1.15);
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at 50% 0%, black 30%, transparent 70%);
}

/* ═══════════════════ Header Nav Links ════════════════ */
:deep(.home__nav-link) {
  font-size: 14.5px;
  font-weight: 550;
  color: var(--c-text);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 7px;
  transition: 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

:deep(.home__nav-link):hover {
  color: var(--c-text);
}

:deep(.home__nav-link.active) {
  color: var(--c-primary);
}

/* ═══════════════════ Header Icon Buttons ═════════════ */
.home__icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--c-text);
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  text-decoration: none;
  transition: 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.home__icon-btn:hover {
  color: var(--c-text);
}

.home__locale-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* ═══════════════════ Content Area ════════════════════ */
.home__content {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  padding: 40px 48px 80px;
}

.home__content-inner {
  max-width: 880px;
}

/* ═══════════════════ Responsive ══════════════════════ */
@media (max-width: 1100px) {
  .home__sidebar {
    display: none;
  }
  .home__content {
    padding: 32px 24px 60px;
  }
}

@media (max-width: 640px) {
  .home__content {
    padding: 24px 16px 48px;
  }
}
</style>
