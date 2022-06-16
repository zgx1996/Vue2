export function createElementVNode(vm, tagName, data, ...children) {
  if (!data) {
    data = {}
  }
  const key = data.key
  key && delete data.key
  return vnode(vm, tagName, key, data, children)
}

export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, key, data, children, text) {
  return { vm, tag, key, data, children, text }
}
