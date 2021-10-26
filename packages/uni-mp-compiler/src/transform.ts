import {
  NOOP,
  EMPTY_OBJ,
  extend,
  isString,
  isArray,
  capitalize,
  camelize,
} from '@vue/shared'

import {
  ConditionalExpression,
  isObjectExpression,
  isConditionalExpression,
  identifier,
  callExpression,
  ObjectExpression,
  objectExpression,
  ObjectProperty,
  SpreadElement,
  isObjectProperty,
  BlockStatement,
  ArrowFunctionExpression,
  ReturnStatement,
  isCallExpression,
  isIdentifier,
  isSpreadElement,
  CallExpression,
} from '@babel/types'
import {
  DirectiveNode,
  ElementNode,
  NodeTypes,
  Property,
  RootNode,
  ParentNode,
  TemplateChildNode,
  TO_DISPLAY_STRING,
  CompilerError,
  helperNameMap,
  ExpressionNode,
  JSChildNode,
  CacheExpression,
  locStub,
} from '@vue/compiler-core'
import IdentifierGenerator from './identifier'
import {
  CodegenRootNode,
  CodegenRootScope,
  CodegenScope,
  CodegenVForScope,
  CodegenVForScopeInit,
  CodegenVIfScope,
  CodegenVIfScopeInit,
  TransformOptions,
} from './options'
import { EXTEND } from './runtimeHelpers'
import { createObjectExpression } from './ast'

export interface ImportItem {
  exp: string | ExpressionNode
  path: string
}

export type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext
) => void | (() => void) | (() => void)[]

export type DirectiveTransform = (
  dir: DirectiveNode,
  node: ElementNode,
  context: TransformContext,
  augmentor?: (ret: DirectiveTransformResult) => DirectiveTransformResult
) => DirectiveTransformResult

interface DirectiveTransformResult {
  props: Property[]
  needRuntime?: boolean | symbol
}

export interface ErrorHandlingOptions {
  onWarn?: (warning: CompilerError) => void
  onError?: (error: CompilerError) => void
}

export const enum BindingComponentTypes {
  SELF = 'self',
  SETUP = 'setup',
  UNKNOWN = 'unknown',
}
export interface TransformContext
  extends Required<Omit<TransformOptions, 'filename'>> {
  selfName: string | null
  currentNode: RootNode | TemplateChildNode | null
  parent: ParentNode | null
  childIndex: number
  helpers: Map<symbol, number>
  components: Set<string>
  imports: ImportItem[]
  bindingComponents: Record<
    string,
    { type: BindingComponentTypes; name: string }
  >
  identifiers: { [name: string]: number | undefined }
  cached: number
  scopes: {
    vFor: number
    vueId: number
  }
  scope: CodegenRootScope
  currentScope: CodegenScope
  currentVueId: string
  vueIds: string[]
  inVOnce: boolean
  helper<T extends symbol>(name: T): T
  removeHelper<T extends symbol>(name: T): void
  helperString(name: symbol): string
  replaceNode(node: TemplateChildNode): void
  removeNode(node?: TemplateChildNode): void
  onNodeRemoved(): void
  addIdentifiers(exp: ExpressionNode | string): void
  removeIdentifiers(exp: ExpressionNode | string): void
  popScope(): CodegenScope | undefined
  addVIfScope(initScope: CodegenVIfScopeInit): CodegenVIfScope
  addVForScope(initScope: CodegenVForScopeInit): CodegenVForScope
  cache<T extends JSChildNode>(exp: T, isVNode?: boolean): CacheExpression | T
}

export function isRootScope(scope: CodegenScope): scope is CodegenRootScope {
  return !isVIfScope(scope) && !isVForScope(scope)
}

export function isVIfScope(scope: CodegenScope): scope is CodegenVIfScope {
  return !!(scope as CodegenVIfScope).condition
}

export function isVForScope(scope: CodegenScope): scope is CodegenVForScope {
  return !!(scope as CodegenVForScope).source
}

export function transform(root: CodegenRootNode, options: TransformOptions) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  root.renderData = createRenderDataExpr(context.scope.properties, context)
  // finalize meta information
  root.helpers = [...context.helpers.keys()]
  root.components = [...context.components]
  root.imports = context.imports
  root.cached = context.cached
  return context
}

export function traverseNode(
  node: RootNode | TemplateChildNode,
  context: TransformContext
) {
  context.currentNode = node
  // apply transform plugins
  const { nodeTransforms } = context
  const exitFns = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context as any)
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit)
      } else {
        exitFns.push(onExit)
      }
    }
    if (!context.currentNode) {
      // node was removed
      return
    } else {
      // node may have been replaced
      node = context.currentNode
    }
  }

  switch (node.type) {
    case NodeTypes.COMMENT:
      // context.helper(CREATE_COMMENT)
      break
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    // for container types, further traverse downwards
    case NodeTypes.IF:
      for (let i = 0; i < node.branches.length; i++) {
        traverseNode(node.branches[i], context)
      }
      break
    case NodeTypes.IF_BRANCH:
    case NodeTypes.FOR:
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, context)
      break
  }

  // exit transforms
  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

export function traverseChildren(
  parent: ParentNode,
  context: TransformContext
) {
  let i = 0
  const nodeRemoved = () => {
    i--
  }
  for (; i < parent.children.length; i++) {
    const child = parent.children[i]
    if (isString(child)) continue
    context.parent = parent
    context.childIndex = i
    context.onNodeRemoved = nodeRemoved
    traverseNode(child, context)
  }
}
function defaultOnError(error: CompilerError) {
  throw error
}

function defaultOnWarn(msg: CompilerError) {
  console.warn(`[Vue warn] ${msg.message}`)
}

export function createTransformContext(
  root: RootNode,
  {
    filename = '',
    isTS = false,
    inline = false,
    hashId = null,
    scopeId = null,
    filters = [],
    bindingMetadata = EMPTY_OBJ,
    cacheHandlers = false,
    prefixIdentifiers = false,
    skipTransformIdentifier = false,
    renderDataSpread = false,
    nodeTransforms = [],
    directiveTransforms = {},
    isBuiltInComponent = NOOP,
    isCustomElement = NOOP,
    expressionPlugins = [],
    onError = defaultOnError,
    onWarn = defaultOnWarn,
  }: TransformOptions
): TransformContext {
  const rootScope: CodegenRootScope = {
    id: new IdentifierGenerator(),
    identifiers: [],
    properties: [],
    parent: null,
  }

  function findVIfParentScope(): CodegenVForScope | CodegenRootScope {
    for (let i = scopes.length - 1; i >= 0; i--) {
      const scope = scopes[i]
      if (isVForScope(scope) || isRootScope(scope)) {
        return scope
      }
    }
    return rootScope
  }

  function createScope(
    id: IdentifierGenerator,
    initScope: CodegenVIfScopeInit | CodegenVForScopeInit
  ) {
    return extend(
      {
        id,
        properties: [],
        parent: scopes[scopes.length - 1],
        get identifiers() {
          return Object.keys(identifiers)
        },
      },
      initScope
    )
  }

  const vueIds: string[] = []
  const identifiers = Object.create(null)
  const scopes: CodegenScope[] = [rootScope]
  const nameMatch = filename.replace(/\?.*$/, '').match(/([^/\\]+)\.\w+$/)
  const context: TransformContext = {
    // options
    selfName: nameMatch && capitalize(camelize(nameMatch[1])),
    isTS,
    inline,
    hashId,
    scopeId,
    filters,
    bindingMetadata,
    cacheHandlers,
    prefixIdentifiers,
    nodeTransforms,
    directiveTransforms,
    expressionPlugins,
    skipTransformIdentifier,
    renderDataSpread,
    isBuiltInComponent,
    isCustomElement,
    onError,
    onWarn,
    // state
    parent: null,
    childIndex: 0,
    helpers: new Map(),
    components: new Set(),
    imports: [],
    bindingComponents: Object.create(null),
    cached: 0,
    identifiers,
    scope: rootScope,
    scopes: {
      vFor: 0,
      vueId: 0,
    },
    get currentScope() {
      return scopes[scopes.length - 1]
    },
    currentNode: root,
    vueIds,
    get currentVueId() {
      return vueIds[vueIds.length - 1]
    },
    inVOnce: false,
    // methods
    popScope() {
      return scopes.pop()
    },
    addVIfScope(initScope) {
      const vIfScope = createScope(
        scopes[scopes.length - 1].id,
        extend(initScope, { parentScope: findVIfParentScope() })
      ) as unknown as CodegenVIfScope
      scopes.push(vIfScope)
      return vIfScope
    },
    addVForScope(initScope) {
      const vForScope = createScope(
        new IdentifierGenerator(),
        initScope
      ) as CodegenVForScope
      scopes.push(vForScope)
      return vForScope
    },
    helper(name) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
      return name
    },
    removeHelper(name) {
      const count = context.helpers.get(name)
      if (count) {
        const currentCount = count - 1
        if (!currentCount) {
          context.helpers.delete(name)
        } else {
          context.helpers.set(name, currentCount)
        }
      }
    },
    helperString(name) {
      return `_${helperNameMap[context.helper(name)]}`
    },
    replaceNode(node) {
      context.parent!.children[context.childIndex] = context.currentNode = node
    },
    removeNode(node) {
      if (!context.parent) {
        throw new Error(`Cannot remove root node.`)
      }
      const list = context.parent!.children
      const removalIndex = node
        ? list.indexOf(node)
        : context.currentNode
        ? context.childIndex
        : -1
      /* istanbul ignore if */
      if (removalIndex < 0) {
        throw new Error(`node being removed is not a child of current parent`)
      }
      if (!node || node === context.currentNode) {
        // current node removed
        context.currentNode = null
        context.onNodeRemoved()
      } else {
        // sibling node removed
        if (context.childIndex > removalIndex) {
          context.childIndex--
          context.onNodeRemoved()
        }
      }
      context.parent!.children.splice(removalIndex, 1)
    },
    onNodeRemoved: () => {},
    addIdentifiers(exp) {
      if (isString(exp)) {
        addId(exp)
      } else if (exp.identifiers) {
        exp.identifiers.forEach(addId)
      } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
        addId(exp.content)
      }
    },
    removeIdentifiers(exp) {
      if (isString(exp)) {
        removeId(exp)
      } else if (exp.identifiers) {
        exp.identifiers.forEach(removeId)
      } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
        removeId(exp.content)
      }
    },
    cache(exp, isVNode = false) {
      return createCacheExpression(context.cached++, exp, isVNode)
    },
  }

  function addId(id: string) {
    const { identifiers } = context
    if (identifiers[id] === undefined) {
      identifiers[id] = 0
    }
    identifiers[id]!++
  }

  function removeId(id: string) {
    context.identifiers[id]!--
  }

  return context
}

function createCacheExpression(
  index: number,
  value: JSChildNode,
  isVNode: boolean = false
): CacheExpression {
  return {
    type: NodeTypes.JS_CACHE_EXPRESSION,
    index,
    value,
    isVNode,
    loc: locStub,
  }
}

export declare type StructuralDirectiveTransform = (
  node: ElementNode,
  dir: DirectiveNode,
  context: TransformContext
) => void | (() => void)

export function createStructuralDirectiveTransform(
  name: string | RegExp,
  fn: StructuralDirectiveTransform
): NodeTransform {
  const matches = isString(name)
    ? (n: string) => n === name
    : (n: string) => name.test(n)

  return (node, context) => {
    if (node.type === NodeTypes.ELEMENT) {
      const { props } = node
      // structural directive transforms are not concerned with slots
      // as they are handled separately in vSlot.ts
      // if (node.tagType === ElementTypes.TEMPLATE && props.some(isVSlot)) {
      //   return
      // }
      const exitFns = []
      for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        if (prop.type === NodeTypes.DIRECTIVE && matches(prop.name)) {
          // structural directives are removed to avoid infinite recursion
          // also we remove them *before* applying so that it can further
          // traverse itself in case it moves the node around
          props.splice(i, 1)
          i--
          const onExit = fn(node, prop, context)
          if (onExit) exitFns.push(onExit)
        }
      }
      return exitFns
    }
  }
}

function createRenderDataExpr(
  properties: (ObjectProperty | SpreadElement)[],
  context: TransformContext
) {
  const objExpr = createObjectExpression(properties)
  if (context.renderDataSpread || !hasSpreadElement(objExpr)) {
    return objExpr
  }
  return transformObjectSpreadExpr(objExpr, context)
}

function hasSpreadElement(expr: ObjectExpression): boolean {
  return expr.properties.some((prop) => {
    if (isSpreadElement(prop)) {
      return true
    } else {
      const objExpr = parseReturnObjExpr(prop as ObjectProperty)
      if (objExpr) {
        return hasSpreadElement(objExpr)
      }
    }
  })
}

function parseReturnObjExpr(prop: ObjectProperty) {
  if (
    isObjectProperty(prop) &&
    isCallExpression(prop.value) &&
    isIdentifier(prop.value.callee) &&
    // 目前硬编码识别 _f,应该读取 context.helperString
    prop.value.callee.name === '_f'
  ) {
    return (
      (
        (prop.value.arguments[1] as ArrowFunctionExpression)
          .body as BlockStatement
      ).body[0] as ReturnStatement
    ).argument as ObjectExpression
  }
}

function transformObjectPropertyExpr(
  prop: ObjectProperty,
  context: TransformContext
) {
  // vFor
  const objExpr = parseReturnObjExpr(prop)
  if (objExpr) {
    if (hasSpreadElement(objExpr)) {
      ;(
        (
          (
            (prop.value as CallExpression)
              .arguments[1] as ArrowFunctionExpression
          ).body as BlockStatement
        ).body[0] as ReturnStatement
      ).argument = transformObjectSpreadExpr(objExpr, context)
    }
  }
  return prop
}

function transformObjectSpreadExpr(
  objExpr: ObjectExpression,
  context: TransformContext
) {
  const properties = objExpr.properties as (ObjectProperty | SpreadElement)[]
  const args: (ObjectExpression | ConditionalExpression)[] = []
  let objExprProperties: ObjectProperty[] = []
  properties.forEach((prop) => {
    if (isObjectProperty(prop)) {
      objExprProperties.push(transformObjectPropertyExpr(prop, context))
    } else {
      if (objExprProperties.length) {
        args.push(objectExpression(objExprProperties))
      }
      args.push(
        transformConditionalExpression(
          prop.argument as ConditionalExpression,
          context
        )
      )
      objExprProperties = []
    }
  })
  if (objExprProperties.length) {
    args.push(objectExpression(objExprProperties))
  }
  if (args.length === 1) {
    return args[0] as ObjectExpression
  }
  return callExpression(identifier(context.helperString(EXTEND)), args)
}
function transformConditionalExpression(
  expr: ConditionalExpression,
  context: TransformContext
) {
  const { consequent, alternate } = expr
  if (isObjectExpression(consequent) && hasSpreadElement(consequent)) {
    expr.consequent = transformObjectSpreadExpr(consequent, context)
  }
  if (isObjectExpression(alternate)) {
    if (hasSpreadElement(alternate)) {
      expr.alternate = transformObjectSpreadExpr(alternate, context)
    }
  } else if (isConditionalExpression(alternate)) {
    transformConditionalExpression(alternate, context)
  }
  return expr
}
