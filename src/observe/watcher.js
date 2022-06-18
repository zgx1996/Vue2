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
    this.get()
  }
}

export default Watcher
