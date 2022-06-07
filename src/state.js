export function initState(vm) {
  if (vm.$options.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
}