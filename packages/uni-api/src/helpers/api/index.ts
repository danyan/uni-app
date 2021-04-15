import {
  extend,
  hasOwn,
  isString,
  isFunction,
  isPlainObject,
} from '@vue/shared'
import { validateProtocols } from '../protocol'
import {
  invokeCallback,
  createAsyncApiCallback,
  onKeepAliveApiCallback,
  offKeepAliveApiCallback,
  findInvokeCallbackByName,
  createKeepAliveApiCallback,
  removeKeepAliveApiCallback,
} from './callback'
import type { CALLBACK_TYPES } from './callback'
import { promisify } from './promise'

function formatApiArgs<T extends ApiLike>(
  args: any[],
  options?: ApiOptions<T>
) {
  const params = args[0]
  if (
    !options ||
    (!isPlainObject(options.formatArgs) && isPlainObject(params))
  ) {
    return
  }
  const formatArgs = options.formatArgs!
  const keys = Object.keys(formatArgs)
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const formatterOrDefaultValue = formatArgs[name]!
    if (isFunction(formatterOrDefaultValue)) {
      const errMsg = formatterOrDefaultValue(args[0][name], params)
      if (isString(errMsg)) {
        return errMsg
      }
    } else {
      // defaultValue
      if (!hasOwn(params, name)) {
        params[name] = formatterOrDefaultValue
      }
    }
  }
}

function invokeSuccess(id: number, name: string, res: unknown) {
  return invokeCallback(id, extend(res || {}, { errMsg: name + ':ok' }))
}

function invokeFail(id: number, name: string, err: string) {
  return invokeCallback(id, { errMsg: name + ':fail' + (err ? ' ' + err : '') })
}

function beforeInvokeApi<T extends ApiLike>(
  name: string,
  args: any[],
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  if (__DEV__) {
    validateProtocols(name!, args, protocol)
  }
  if (options && options.beforeInvoke) {
    const errMsg = options.beforeInvoke(args)
    if (isString(errMsg)) {
      return errMsg
    }
  }
  const errMsg = formatApiArgs<T>(args, options)
  if (errMsg) {
    return errMsg
  }
}

function checkCallback(callback: Function) {
  if (!isFunction(callback)) {
    throw new Error(
      'Invalid args: type check failed for args "callback". Expected Function'
    )
  }
}
function wrapperOnApi<T extends ApiLike>(
  name: string,
  fn: Function,
  options?: ApiOptions<T>
) {
  return (callback: Function) => {
    checkCallback(callback)
    const errMsg = beforeInvokeApi(name, [callback], undefined, options)
    if (errMsg) {
      throw new Error(errMsg)
    }
    // 是否是首次调用on,如果是首次，需要初始化onMethod监听
    const isFirstInvokeOnApi = !findInvokeCallbackByName(name)
    createKeepAliveApiCallback(name, callback)
    if (isFirstInvokeOnApi) {
      onKeepAliveApiCallback(name)
      fn()
    }
  }
}

function wrapperOffApi<T extends ApiLike>(
  name: string,
  fn: Function,
  options?: ApiOptions<T>
) {
  return (callback: Function) => {
    checkCallback(callback)
    const errMsg = beforeInvokeApi(name, [callback], undefined, options)
    if (errMsg) {
      throw new Error(errMsg)
    }
    name = name.replace('off', 'on')
    removeKeepAliveApiCallback(name, callback)
    // 是否还存在监听，若已不存在，则移除onMethod监听
    const hasInvokeOnApi = findInvokeCallbackByName(name)
    if (!hasInvokeOnApi) {
      offKeepAliveApiCallback(name)
      fn()
    }
  }
}

function wrapperTaskApi<T extends ApiLike>(
  name: string,
  fn: Function,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return (args: Record<string, any>) => {
    const id = createAsyncApiCallback(name, args, options)
    const errMsg = beforeInvokeApi(name, [args], protocol, options)
    if (errMsg) {
      return invokeFail(id, name, errMsg)
    }
    return fn(args, {
      resolve: (res: unknown) => invokeSuccess(id, name, res),
      reject: (err: string) => invokeFail(id, name, err),
    })
  }
}

function wrapperSyncApi<T extends ApiLike>(
  name: string,
  fn: Function,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return (...args: any[]) => {
    const errMsg = beforeInvokeApi(name, args, protocol, options)
    if (errMsg) {
      throw new Error(errMsg)
    }
    return fn.apply(null, args)
  }
}

function wrapperAsyncApi<T extends ApiLike>(
  name: string,
  fn: Function,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return wrapperTaskApi(name, fn, protocol, options)
}

export function defineOnApi<T extends ApiLike>(
  name: string,
  fn: () => void,
  options?: ApiOptions<T>
) {
  return (wrapperOnApi(name, fn, options) as unknown) as T
}

export function defineOffApi<T extends ApiLike>(
  name: string,
  fn: () => void,
  options?: ApiOptions<T>
) {
  return (wrapperOffApi(name, fn, options) as unknown) as T
}

export function defineTaskApi<T extends TaskApiLike, P = AsyncApiOptions<T>>(
  name: string,
  fn: (
    args: Omit<P, CALLBACK_TYPES>,
    res: {
      resolve: (res?: AsyncApiRes<P>) => void
      reject: (err?: string) => void
    }
  ) => ReturnType<T>,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return (promisify(
    wrapperTaskApi(name, fn, __DEV__ ? protocol : undefined, options)
  ) as unknown) as T
}

export function defineSyncApi<T extends ApiLike>(
  name: string,
  fn: T,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return (wrapperSyncApi(
    name,
    fn,
    __DEV__ ? protocol : undefined,
    options
  ) as unknown) as T
}

export function defineAsyncApi<T extends AsyncApiLike, P = AsyncApiOptions<T>>(
  name: string,
  fn: (
    args: Omit<P, CALLBACK_TYPES>,
    res: {
      resolve: (res?: AsyncApiRes<P>) => void
      reject: (err?: string) => void
    }
  ) => void,
  protocol?: ApiProtocols<T>,
  options?: ApiOptions<T>
) {
  return promisify(
    wrapperAsyncApi(name, fn as any, __DEV__ ? protocol : undefined, options)
  ) as AsyncApi<P>
}
