import { createElementVNode, createTextVNode } from './vdom/index.js'
export function mountComponent(vm, el) {
  vm.$el = el
  vm._update(vm._render())
}

export function initLifecycle(Vue) {
  Vue.prototype._update = function (vnode) {}
  Vue.prototype._render = function () {
    const vm = this
    const vnode = vm.$options.render.call(vm)
    console.log('_render vnode', vnode)
  }
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }
  Vue.prototype._s = function () {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._v = function (text) {
    return JSON.stringify(text)
  }
}
