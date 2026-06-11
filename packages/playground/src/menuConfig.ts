/**
 * VueCraft 组件库菜单配置
 *
 * 设计原则：
 * - 只做 Element Plus 没有的高价值复合组件
 * - 每个组件解决一个真实痛点
 * - 精而不杂
 */

export interface MenuItem {
  key: string
  name: string
  descKey: string
  path: string
  icon: string
  status: 'done' | 'planned'
}

export interface MenuGroup {
  labelKey: string
  nav: 'guide' | 'components'
  items: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
  // ═══════════════════ 指南 ═══════════════════
  {
    labelKey: 'menu.groups.gettingStarted',
    nav: 'guide',
    items: [
      {
        key: 'install',
        name: 'Install',
        descKey: 'menu.desc.install',
        path: '/guide/install',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      },
      {
        key: 'quick-start',
        name: 'QuickStart',
        descKey: 'menu.desc.quickStart',
        path: '/guide/quick-start',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      },
      {
        key: 'i18n',
        name: 'I18n',
        descKey: 'menu.desc.i18n',
        path: '/guide/i18n',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      },
    ],
  },
  {
    labelKey: 'menu.groups.about',
    nav: 'guide',
    items: [
      {
        key: 'design',
        name: 'Design',
        descKey: 'menu.desc.design',
        path: '/guide/design',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      },
      {
        key: 'changelog',
        name: 'Changelog',
        descKey: 'menu.desc.changelog',
        path: '/guide/changelog',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
      },
    ],
  },

  // ═══════════════════ 组件 ═══════════════════
  {
    labelKey: 'menu.groups.dataEntry',
    nav: 'components',
    items: [
      {
        key: 'schema-form',
        name: 'SchemaForm',
        descKey: 'menu.desc.schemaForm',
        path: '/components/schema-form',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
      },
      {
        key: 'search-bar',
        name: 'SearchBar',
        descKey: 'menu.desc.searchBar',
        path: '/components/search-bar',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/></svg>',
      },
      {
        key: 'tree-transfer',
        name: 'TreeTransfer',
        descKey: 'menu.desc.treeTransfer',
        path: '/components/tree-transfer',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
      },
    ],
  },
  {
    labelKey: 'menu.groups.dataDisplay',
    nav: 'components',
    items: [
      {
        key: 'table-pro',
        name: 'TablePro',
        descKey: 'menu.desc.tablePro',
        path: '/components/table-pro',
        status: 'done',
        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>',
      },
    ],
  },
]
