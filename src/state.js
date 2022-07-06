import {
  observe
} from './observe/index.js'
export function initState(vm) {
  if (vm.$options.data) {
    initData(vm)
  }
  if (vm.$options.computed) {
    initComputed(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  observe(data)
  proxy(vm, '_data', data)
}

function initComputed(vm) {
  let computed = vm.$options.computed
  if (computed) {
    for (let key in computed) {
      defineComputed(vm, key, computed[key])
    }
  }
}

function defineComputed(target, key, userDef) {
  const getter = typeof userDef === 'function' ? userDef : userDef.get
  const setter = userDef.set || (() => {})
  Object.defineProperty(target, key, {
    get: getter,
    set: setter
  })
}

function proxy(vm, target, data) {
  Object.keys(data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[target][key]
      },
      set(newValue) {
        vm[target][key] = newValue
      }
    })
  })
}