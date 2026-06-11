import type { App, Component } from 'vue'
import './styles/index.css'

// Components
import SchemaForm from './components/schema-form/SchemaForm.vue'
import SearchBar from './components/search-bar/SearchBar.vue'
import TablePro from './components/table-pro/TablePro.vue'
import TreeTransfer from './components/tree-transfer/TreeTransfer.vue'

const components: Component[] = [
  SchemaForm,
  SearchBar,
  TablePro,
  TreeTransfer,
]

const install = (app: App): void => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

export { install }
export default { install }

// Named exports — components
export { SchemaForm }
export { SearchBar }
export { TablePro }
export { TreeTransfer }

// Named exports — types
export type {
  FormSchema,
  FieldConfig,
  FieldType,
  BuiltInFieldType,
  SelectOption,
  CustomWidgetRender,
  CustomWidgetsMap,
} from './components/schema-form'

export type { SearchField } from './components/search-bar'
export type { TableColumn, PaginationConfig } from './components/table-pro'
export type { TreeNode } from './components/tree-transfer'
