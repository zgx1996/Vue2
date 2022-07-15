import Dep from './observe/dep.js'
import {
    observe
} from './observe/index.js'
import Watcher from './observe/watcher.js'
export function initState(vm) {
    if (vm.$options.data) {
        initData(vm)
    }
    if (vm.$options.computed) {
        initComputed(vm)
    }
    if (vm.$options.watch) {
        initWatch(vm)
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
        const watchers = vm._computedWatchers = {}
        for (let key in computed) {
            const userDef = computed[key]
            const fn = typeof userDef === 'function' ? userDef : userDef.get
            watchers[key] = new Watcher(vm, fn, { lazy: true })
            defineComputed(vm, key, userDef)
        }
    }
}

function initWatch(vm) {
    let watch = vm.$options.watch
    if (watch) {
        for (let key in watch) {
            const handler = watch[key]
            if (Array.isArray(handler)) {
                handler.forEach(h => {
                    createWatch(vm, key, h)
                })
            } else {
                createWatch(vm, key, handler)
            }
        }
    }
}

function createWatch(vm, key, handler) {
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(key, handler)
}

function defineComputed(target, key, userDef) {
    const setter = userDef.set || (() => {})
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function() {
        const watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
        }
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
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