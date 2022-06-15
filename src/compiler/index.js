const ncname = `[a-zA-Z_][\\w\\-\\.]*`
// ?: 在分组匹配中可以产生无编号的分组
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 对模板进行编译
export function compileToFunction(template) {
  //1. 将template转化成ast语法树
  const ast = parseHtml(template)
  //2. 生成render方法
  return () => {}
}

function createASTElement(tagName, attrs, children, parent, text) {
  return { tagName, attrs, children, parent, text }
}

function parseHtml(html) {
  const stack = []
  let currentNode = null
  let root = null
  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs)
    if (!element.children) {
      element.children = []
    }
    if (root == null) {
      root = element
      element.parent = null
    } else {
      currentNode.children.push(element)
      element.parent = currentNode
    }
    stack.push(element)
    currentNode = element
    console.log('开始', tagName)
  }
  function chars(text) {
    if (!text.trim()) return
    const element = createASTElement(undefined, undefined, undefined, undefined, text)
    element.parent = currentNode
    currentNode.children.push(element)
    console.log('文本', text)
  }
  function end(tagName) {
    console.log('结束', tagName)
    stack.pop()
    currentNode = stack[stack.length - 1]
  }

  function advance(step) {
    html = html.substring(step)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        const name = attr[1]
        let value = attr[3] || attr[4] || attr[5]
        if (name === 'style') {
          const styleItems = value.split(';')
          value = []
          styleItems?.forEach((styleItem) => {
            const [name, styleItemValue] = styleItem.split(':')
            const styleItemValueTrim = styleItemValue.trim()
            value.push({ name, value: styleItemValueTrim })
          })
        }
        match.attrs.push({
          name,
          value
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      console.log('match', match)
      return match
    }
    return false
  }
  while (html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  console.log('html', html)
  console.log('root', root)
}
