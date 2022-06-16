import { defaultTagRE, ELEMENT_TYPE, parseHtml, TEXT_TYPE } from './parse'

// 对模板进行编译
export function compileToFunction(template) {
  //1. 将template转化成ast语法树
  const ast = parseHtml(template)
  //2. 生成render方法
  console.log('ast', ast)
  let code = codegen(ast)
  code = `with(this){return ${code}}`
  const render = new Function(code)
  console.log('render', render)
  return render
}

function gen(node) {
  if (node.type === ELEMENT_TYPE) {
    return codegen(node)
  } else if (node.type === TEXT_TYPE) {
    const text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      let textExec = null
      const tokens = []
      while ((textExec = defaultTagRE.exec(text))) {
        const pureText = text.substring(lastIndex, defaultTagRE.lastIndex - textExec[0].length)
        lastIndex = defaultTagRE.lastIndex
        if (pureText.trim()) {
          tokens.push(`${JSON.stringify(pureText.trim())}`)
        }
        tokens.push(`_s(${textExec[1]})`)
      }
      if (lastIndex < text.length) {
        const rest = text.substring(lastIndex, text.length)
        if (rest.trim()) {
          tokens.push(JSON.stringify(rest.trim()))
        }
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genProps(attrs) {
  let str = ''
  attrs.forEach((attr) => {
    const name = attr.name
    if (name === 'style') {
      let style = attr.value
      let styleStr = ''
      style.forEach((styleItem) => {
        styleStr += styleItem.name + ':' + JSON.stringify(styleItem.value) + ','
      })
      styleStr = styleStr.substring(0, styleStr.length - 1)
      str += name + ':' + '{' + styleStr + '}' + ','
    } else {
      str += name + ':' + JSON.stringify(attr.value) + ','
    }
  })
  return `{${str.substring(0, str.length - 1)}}`
}

function genChild(node) {
  const children = node.children
  return children && children.map((item) => gen(item)).join(',')
}

function codegen(ast) {
  const children = genChild(ast)
  return `_c('${ast.tagName}',${ast.attrs?.length ? genProps(ast.attrs) : null},${
    ast.children.length ? children : null
  })`
}
