/**
 * SearchBar — Enterprise search bar type definitions
 *
 * Design goal: a specialized inline form with search/reset buttons
 * and expand/collapse, built on top of SchemaForm.
 *
 * SearchField is intentionally a subset of FieldConfig — SearchBar
 * delegates all field rendering to SchemaForm, so all field types
 * and extension mechanisms (props, slots, customWidgets) work.
 */
import type { FieldConfig } from '../schema-form'

/**
 * Field definition for SearchBar.
 *
 * Extends SchemaForm's FieldConfig with SearchBar-specific properties.
 * The only practical difference is that SearchBar forces inline layout
 * and wraps the form with search/reset buttons + expand/collapse.
 */
export interface SearchField extends FieldConfig {
  /**
   * When true, this field is hidden by default and only revealed
   * when the user clicks the expand/collapse toggle.
   */
  collapsed?: boolean
}
