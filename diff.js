import mount from "./mount"
import render from "./render"

const diff = function (vOldNode, vNewNode) {
  if (vNewNode === undefined) {
    return $node => {
      $node.remove()
      return undefined
    }
  }

  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = render(vNewNode)
        return mount($newNode, $node)
      }
    } else {
      return $node => $node
    }
  }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode)
      return mount($newNode, $node)
    }
  }

  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
  const patchChildren = diffChildren(vOldNode.chilldren, vNewNode.children)

  return $node => {
    patchAttrs($node)
    patchChildren($node)
    return $node
  }
}

const diffAttrs = function (oldAttrs, newAttrs) {
  const patches = []

  // 新增新屬性到 patches 陣列
  for (const key in newAttrs) {
    patches.push($node => {
      $node.setAttribute(key, newAttrs[key])
      return $node
    })
  }

  // 如果"沒有"舊屬性在新屬性上，
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(key)
        return $node
      })
    }
  }

  return $node => {
    patches.forEach(patch => {
      patch($node)
    })
  }
}

export default diff