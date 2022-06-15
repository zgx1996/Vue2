import { observe } from './observe/index.js'
export function initState(vm) {
  if (vm.$options.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  observe(data)
  proxy(vm, '_data', data)
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
