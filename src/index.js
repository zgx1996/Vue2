import { initMixin } from './initMixin'
import { initLifecycle } from './lifecycle'
export default function Vue(options) {
  this._init(options)
}

initMixin(Vue)
initLifecycle(Vue)
