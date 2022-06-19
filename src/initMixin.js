import {
  compileToFunction
} from './compiler/index.js'
import {
  callHook,
  mountComponent
} from './lifecycle.js'
import {
  initState
} from './state'
import {
  mergeOptions
} from './utils/index.js'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options, options)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    if (options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    const ops = vm.$options
    if (!ops.render) {
      let template = null
      if (ops.el) {
        template = el.outerHTML
      }
      if (ops.template) {
        template = ops.template
      }
      if (template) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }

    mountComponent(vm, el)
  }
}