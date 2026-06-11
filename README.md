# VueCraft

Vue 3 + Element Plus lightweight secondary-wrapping component library.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4fc08d?logo=vue.js)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.14-409eff?logo=element)](https://element-plus.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-monorepo-orange?logo=pnpm)](https://pnpm.io/)

## Features

- 🎯 **4 production-grade components** — SchemaForm, TablePro, SearchBar, TreeTransfer
- 🧩 **Flat, simple API** — no prefix, no BEM, no dark mode overhead
- 🎨 **Lightweight** — depends only on Vue 3 + Element Plus
- 🌐 **i18n-ready** — zero hardcoded user-facing text in library components
- 📦 **ESM + CJS dual output** — tree-shakable named exports
- ✅ **40+ unit tests** per component — [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/)

## Components

| Component | Description |
|-----------|-------------|
| **SchemaForm** | Schema-driven form builder — 12 built-in field types, grid layout, conditional visibility, 3-layer extension |
| **TablePro** | Advanced data table with pagination, selection, and slot-based customization |
| **SearchBar** | Configurable search form with inline validation and filter presets |
| **TreeTransfer** | Tree-structured data shuttle with checkable nodes and search |

## Installation

```bash
# pnpm (recommended)
pnpm add vuecraft

# npm
npm install vuecraft

# yarn
yarn add vuecraft
```

### Peer Dependencies

```bash
pnpm add vue@^3.5 element-plus@^2.14
```

Make sure you've also registered Element Plus in your app:

```ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(ElementPlus)
```

## Quick Start

### Full Registration

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCraft from 'vuecraft'
import 'vuecraft/dist/vuecraft.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus).use(VueCraft).mount('#app')
```

### On-Demand Import

```vue
<script setup lang="ts">
import { SchemaForm } from 'vuecraft'
import type { FormSchema, FieldConfig } from 'vuecraft'
import 'vuecraft/dist/vuecraft.css'
</script>
```

## Components

### SchemaForm

Schema-driven form rendering — define forms declaratively with a `FormSchema` array.

**12 built-in field types:** `input`, `textarea`, `number`, `select`, `radio`, `checkbox`, `switch`, `date-picker`, `time-picker`, `color-picker`, `rate`, `slider`

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { SchemaForm } from 'vuecraft'
import type { FormSchema } from 'vuecraft'

const formData = reactive({ name: '', age: 18 })

const schema: FormSchema = {
  fields: [
    { key: 'name', type: 'input', label: 'Name' },
    { key: 'age', type: 'number', label: 'Age', defaultValue: 18 },
  ],
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

#### Extension Layers

| Layer | Mechanism | Use Case |
|-------|-----------|----------|
| `field.props` | Pass props to the underlying Element Plus component | `{ clearable: true }` on an input |
| `field.slot` | Named slot override per field | Custom layout, extra buttons |
| `customWidgets` | Registered render functions | Reusable non-standard field types |

#### Exposed API

```ts
const formRef = ref<InstanceType<typeof SchemaForm>>()

// Validate all fields → Promise<boolean>
await formRef.value!.validate()

// Reset to defaults, clear validation
formRef.value!.resetFields()

// Raw ElForm instance
formRef.value!.elFormRef
```

> See the [playground](#development) for interactive examples covering grid layout, conditional visibility, validation rules, custom widgets, and slot overrides.

### TablePro

Advanced data table wrapping ElTable with built-in pagination, selection handling, and column configuration.

### SearchBar

Configurable search form built on the same `FieldConfig` model as SchemaForm. Supports inline validation, dynamic field rendering, and filter presets.

### TreeTransfer

Tree-structured data shuttle component. Features checkable tree nodes, left-right transfer, and built-in search filtering.

---

For detailed API documentation on each component, refer to the [playground site](#development) which includes live demos with code samples.

## Development

```bash
# Clone and install
git clone <repo-url> && cd VueCraft
pnpm install

# Start playground dev server (port 5173)
pnpm dev

# Run unit tests
pnpm test

# Type-check
pnpm typecheck

# Build library
pnpm build:lib

# Lint & format
pnpm lint
pnpm format
```

### Monorepo Structure

```
VueCraft/
├── packages/
│   ├── vuecraft/          # Library source
│   │   └── src/
│   │       ├── components/
│   │       │   ├── schema-form/   # SchemaForm (40 tests)
│   │       │   ├── table-pro/     # TablePro
│   │       │   ├── search-bar/    # SearchBar
│   │       │   └── tree-transfer/ # TreeTransfer
│   │       └── styles/            # Flat CSS
│   └── playground/        # Vue 3 docs site
│       └── src/
│           ├── locales/           # en / zh i18n
│           └── views/             # Demo pages
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── eslint.config.mjs
```

## License

[Apache License 2.0](./LICENSE)
