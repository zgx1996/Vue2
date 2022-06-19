import {
  mergeOptions
} from "./utils/index.js"

export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}