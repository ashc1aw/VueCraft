<template>
  <header class="vc-header" :style="{ height: height }">
    <div class="vc-header__inner">
      <div class="vc-header__left">
        <slot name="logo">
          <a href="/" class="vc-header__logo">
            <svg class="vc-header__logo-mark" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="vc-header__logo-text">VueCraft</span>
          </a>
        </slot>
      </div>
      <nav class="vc-header__center">
        <slot />
      </nav>
      <div class="vc-header__right">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    height?: string
  }>(),
  {
    height: '60px',
  },
)
</script>

<style scoped>
.vc-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid transparent;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.vc-header__inner {
  max-width: 1340px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 40px;
}

.vc-header__left {
  flex-shrink: 0;
}

/* ── Logo ──────────────────────────────────────────── */
.vc-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1a1a2e;
}

.vc-header__logo-mark {
  width: 26px;
  height: 26px;
  color: #409eff;
}

.vc-header__logo-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.4px;
  background: linear-gradient(135deg, #409eff 20%, #6366f1 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vc-header__center {
  display: flex;
  gap: 4px;
  flex: 1;
}

.vc-header__right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
</style>
