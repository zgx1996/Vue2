let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    console.log('Dep.target', Dep.target)
    Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

Dep.target = null

export default Dep
