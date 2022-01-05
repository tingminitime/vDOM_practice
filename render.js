const render = function (vNode) {
  // console.log(vNode)
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }
  return renderElement(vNode)
}

// 不是單純字串
const renderElement = function ({ tagName, attrs, children }) {
  const $el = document.createElement(tagName)
  // HTML 標籤屬性設定
  for (const key in attrs) {
    $el.setAttribute(key, attrs[key])
  }
  // HTML 標籤的子元素遞迴設定
  children.forEach(child => {
    const $child = render(child)
    $el.appendChild($child)
  })
  // console.log('e.target: ', $el)
  return $el
}

export default render 