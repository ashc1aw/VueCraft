import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      redirect: '/guide/install',
      children: [
        // ════════════ 指南 ════════════
        {
          path: 'guide/install',
          name: 'guide-install',
          component: () => import('../views/guide/Install.vue'),
        },
        {
          path: 'guide/quick-start',
          name: 'guide-quick-start',
          component: () => import('../views/guide/QuickStart.vue'),
        },
        {
          path: 'guide/i18n',
          name: 'guide-i18n',
          component: () => import('../views/guide/I18n.vue'),
        },
        {
          path: 'guide/design',
          name: 'guide-design',
          component: () => import('../views/guide/Design.vue'),
        },
        {
          path: 'guide/changelog',
          name: 'guide-changelog',
          component: () => import('../views/guide/Changelog.vue'),
        },
        // ════════════ 组件 ════════════
        {
          path: 'components/schema-form',
          name: 'component-schema-form',
          component: () => import('../views/components/SchemaFormDemo.vue'),
        },
        {
          path: 'components/search-bar',
          name: 'component-search-bar',
          component: () => import('../views/components/SearchBarDemo.vue'),
        },
        {
          path: 'components/tree-transfer',
          name: 'component-tree-transfer',
          component: () => import('../views/components/TreeTransferDemo.vue'),
        },
        {
          path: 'components/table-pro',
          name: 'component-table-pro',
          component: () => import('../views/components/TableProDemo.vue'),
        },
      ],
    },
  ],
})

export default router
