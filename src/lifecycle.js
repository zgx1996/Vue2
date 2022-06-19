import Watcher from './observe/watcher.js'
import {
  createElementVNode,
  createTextVNode
} from './vdom/index.js'
export function mountComponent(vm, el) {
  vm.$el = el
  const updateComponent = () => vm._update(vm._render())
  const watch = new Watcher(vm, updateComponent, true)
}

function patchProps(el, attrs) {
  if (!attrs) return
  Object.keys(attrs).forEach((key) => {
    if (key === 'style') {
      const style = attrs[key]
      Object.keys(style).forEach((styleKey) => {
        el.style[styleKey] = style[styleKey]
      })
    } else {
      el.setAttribute(key, attrs[key])
    }
  })
}

function createEle(vnode) {
  console.log('createEle', vnode)
  const {
    tag,
    text,
    children,
    data
  } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    if (children) {
      children.forEach((item) => {
        item && vnode.el.appendChild(createEle(item))
      })
    }
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function patch(oldVnode, vnode) {
  console.log('vnode', vnode)
  if (oldVnode.nodeType) {
    // 初次渲染
    const element = oldVnode
    const parentNode = element.parentNode
    const newEle = createEle(vnode)
    parentNode.insertBefore(newEle, element.nextSibling)
    parentNode.removeChild(element)
    return newEle
  } else {
    // diff 算法
  }
}

export function initLifecycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const el = vm.$el
    vm.$el = patch(el, vnode)
  }
  Vue.prototype._render = function () {
    const vm = this
    const vnode = vm.$options.render.call(vm)
    return vnode
  }
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }
  Vue.prototype._s = function (value) {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value
  }

  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => handler.call(vm))
  }
}