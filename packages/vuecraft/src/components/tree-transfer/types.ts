/**
 * TreeTransfer — Tree-structure transfer component type definitions
 *
 * Wraps two el-tree panels with transfer buttons for moving
 * hierarchical data between "available" and "selected" sides.
 */

/**
 * Tree node data — compatible with el-tree's data format.
 *
 * The properties `id`, `label`, `children`, and `disabled` are the default
 * field names used by el-tree. When `nodeKey` / `labelKey` / `childrenKey`
 * props are set, the corresponding keys on your data objects are used instead.
 * The index signature `[key: string]: unknown` supports any consumer-defined
 * field structure — you are not forced to use the default names.
 */
export interface TreeNode {
  [key: string]: unknown
}
