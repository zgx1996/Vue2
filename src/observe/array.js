const oldArrayProto = Array.prototype

const methods = ['push', 'pop', 'unshift', 'shift', 'sort', 'splice', 'reverse']

const newArrayProto = Object.create(oldArrayProto)

methods.forEach((method) => {
    newArrayProto[method] = function(...args) {
        const result = oldArrayProto[method].call(this, ...args)
        let inserted = null
        const ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
            default:
                break
        }
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        return result
    }
})

export default newArrayProto