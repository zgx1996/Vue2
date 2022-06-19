import Dep from './dep'

let id = 0
class Watcher {
  constructor(vm, fn, options) {
    this.renderWatch = options
    this.id = id++
    this.getter = fn
    this.deps = []
    this.depsId = new Set()
    this.get()
  }

  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }
  addDep(dep) {
    const depId = dep.id
    if (!this.depsId.has(depId)) {
      this.depsId.add(depId)
      dep.addSub(this)
      this.deps.push(dep)
    }
  }
  update() {
    queueWatcher(this)
  }
  run() {
    this.get()
  }
}

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach(watcher => watcher.run())
}

function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}

function flushCallback() {
  let flushCbs = callbacks.slice(0)
  waiting = false
  callbacks = []
  flushCbs.forEach(cb => cb())
}

function timerFunc() {
  if (Promise) {
    Promise.resolve().then(flushCallback)
  } else if (MutationObserver) {
    const observe = new MutationObserver(flushCallback)
    const textNode = Document.createTextNode(1)
    observe.observe(textNode, {
      characterData: true
    })
    textNode.textContent = 2
  } else if (setImmediate) {
    setImmediate(flushCallback)
  } else {
    setTimeout(flushCallback, 0)
  }
}

let callbacks = []
let waiting = false
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    timerFunc()
    waiting = true
  }
}

export default Watcher