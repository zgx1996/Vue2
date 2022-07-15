import Dep, { popTarget, pushTarget } from './dep'

let id = 0
class Watcher {
    constructor(vm, expOrFn, options, cb) {
        this.vm = vm
        this.renderWatch = options
        this.id = id++;
        if (typeof expOrFn === 'string') {
            this.getter = function() {
                return vm[expOrFn]
            }
        } else {
            this.getter = expOrFn
        }
        this.deps = []
        this.depsId = new Set()
        this.lazy = options.lazy
        this.dirty = this.lazy
        this.value = this.lazy ? undefined : this.get()
        this.user = options.user
        this.cb = cb
    }

    get() {
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    evaluate() {
        const value = this.get()
        this.dirty = false
        this.value = value
    }
    addDep(dep) {
        const depId = dep.id
        if (!this.depsId.has(depId)) {
            this.depsId.add(depId)
            dep.addSub(this)
            this.deps.push(dep)
        }
    }
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
    }
    run() {
        const oldValue = this.value
        const newValue = this.get()

        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
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