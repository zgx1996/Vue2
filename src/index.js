import {
  initMixin
} from "./initMixin"

export default function Vue(options) {
  this._init(options)
}

initMixin(Vue)