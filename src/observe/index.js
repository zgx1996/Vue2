import newArrayProto from './array'
import Dep from './dep'
class Observe {
    constructor(data) {
        this.dep = new Dep()
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            data.__proto__ = newArrayProto
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    walk(data) {
        Object.keys(data).forEach((key) => {
            defineReactive(data, key, data[key])
        })
    }
    observeArray(data) {
        data.forEach((item) => {
            observe(item)
        })
    }
}

export function defineReactive(data, key, value) {
    let childOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get: function() {
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend() // 让对象本身和数组也实现依赖收集
                }
                if (Array.isArray(value)) {
                    dependArray(value)
                }
            }
            return value
        },
        set: function(newValue) {
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}

function dependArray(array) {
    array.forEach(item => {
        item.__ob__ && item.__ob__.dep.depend()
        if (Array.isArray(item)) {
            dependArray(item)
        }
    })
}

export function observe(data) {
    if (typeof data != 'object' || data === null) {
        return
    }
    if (data.__ob__ instanceof Observe) {
        return data.__ob__
    }
    return new Observe(data)
}