<template>
  <aside class="sidebar" :style="{ width }">
    <div class="sidebar-scroll">
      <div v-for="group in menuGroups" :key="group.labelKey" class="sidebar-section">
        <p class="sidebar-label">{{ t(group.labelKey) }}</p>
        <a
          v-for="item in group.items"
          :key="item.key"
          class="sidebar-link"
          :class="{
            active: isActive(item),
            planned: item.status === 'planned',
          }"
          :href="'#' + item.path"
          @click.prevent="onMenuClick(item)"
        >
          <span class="link-icon" v-html="item.icon" />
          <span class="link-body">
            <span class="link-name">{{ item.name }} {{ t(item.descKey) }}</span>
          </span>
        </a>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Router } from 'vue-router'

export interface SidebarItem {
  key: string
  name: string
  descKey: string
  path: string
  icon: string
  status: 'done' | 'planned'
}

export interface SidebarGroup {
  labelKey: string
  items: SidebarItem[]
}

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    menuGroups: SidebarGroup[]
    width?: string
    routerInstance?: Router
  }>(),
  {
    width: '250px',
    routerInstance: undefined,
  },
)

const emit = defineEmits<{
  select: [item: SidebarItem]
}>()

const currentPath = ref('')

function isActive(item: SidebarItem): boolean {
  if (props.routerInstance) {
    const route = props.routerInstance.currentRoute.value
    return route.path === item.path
  }
  return currentPath.value === item.path
}

function onMenuClick(item: SidebarItem) {
  if (item.status === 'planned') return
  currentPath.value = item.path
  if (props.routerInstance) {
    // eslint-disable-next-line vue/no-mutating-props
    props.routerInstance.push(item.path)
  }
  emit('select', item)
}
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────── */
.sidebar {
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding: 28px 0;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.sidebar-scroll:hover {
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

/* ── 分组 ──────────────────────────────────────── */
.sidebar-section {
  margin-bottom: 24px;
}

/* ── 分组标签 ──────────────────────────────────── */
.sidebar-label {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #1a1a2e;
  padding: 0 12px;
  margin-bottom: 8px;
  user-select: none;
}

/* ── 菜单项 ────────────────────────────────────── */
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 520;
  color: #1a1a2e;
  text-decoration: none;
  border-radius: 7px;
  margin-bottom: 2px;
  transition: 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.sidebar-link:hover {
  color: #1a1a2e;
  background: rgba(0, 0, 0, 0.03);
}

.sidebar-link:hover .link-name {
  color: #1a1a2e;
}

.sidebar-link.active {
  color: #409eff !important;
  background: #ecf4ff;
  font-weight: 600;
  opacity: 1;
}

.sidebar-link.active:hover {
  color: #409eff !important;
  background: #ecf4ff;
}

.sidebar-link.active .link-name,
.sidebar-link.active .link-icon {
  color: #409eff !important;
}

.sidebar-link.active:hover .link-name,
.sidebar-link.active:hover .link-icon {
  color: #409eff !important;
}

/* ── planned 状态 ──────────────────────────────── */
.sidebar-link.planned {
  opacity: 0.72;
}

.sidebar-link.planned:hover {
  opacity: 1;
}

/* ── 图标 ──────────────────────────────────────── */
.link-icon {
  display: flex;
  align-items: center;
  opacity: 0.55;
  flex-shrink: 0;
}

.sidebar-link.active .link-icon {
  opacity: 1;
}

/* ── 文本 ──────────────────────────────────────── */
.link-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.link-name {
  font-size: 14px;
  font-weight: 550;
  color: inherit;
  line-height: 1.3;
}
</style>
