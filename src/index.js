import {
    initGlobalApi
} from './globalApi'
import {
    initMixin
} from './initMixin'
import {
    initLifecycle
} from './lifecycle'
import Watcher, {
    nextTick
} from './observe/watcher'
export default function Vue(options) {
    this._init(options)
}

initGlobalApi(Vue)
initMixin(Vue)
initLifecycle(Vue)

Vue.prototype.$nextTick = nextTick

Vue.prototype.$watch = function(expOrFn, cb) {
    new Watcher(this, expOrFn, { user: true }, cb)
}