const ncname = `[a-zA-Z_][\\w\\-\\.]*`
// ?: 在分组匹配中可以产生无编号的分组
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export const ELEMENT_TYPE = 'elementType'
export const TEXT_TYPE = 'textType'

function createASTElement(tagName, attrs) {
  return {
    tagName,
    attrs,
    children: [],
    parent: null,
    type: ELEMENT_TYPE
  }
}

export function parseHtml(html) {
  const stack = []
  let currentNode = null
  let root = null

  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs)
    if (root == null) {
      root = element
      element.parent = null
    } else {
      currentNode.children.push(element)
      element.parent = currentNode
    }
    stack.push(element)
    currentNode = element
  }

  function chars(text) {
    if (!text.trim()) return
    text = text.trim()
    currentNode.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentNode
    })
  }

  function end(tagName) {
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
          styleItems.forEach((styleItem) => {
            const [name, styleItemValue] = styleItem.split(':')
            const styleItemValueTrim = styleItemValue.trim()
            value.push({
              name,
              value: styleItemValueTrim
            })
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
  return root
}