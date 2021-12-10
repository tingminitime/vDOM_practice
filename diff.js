import mount from "./mount"
import render from "./render"

// 這邊都是回傳函式
const diff = function (vOldNode, vNewNode) {
  // 傳進來的新節點如果是 undefined，代表該節點是要被刪除的節點，return undefined
  if (vNewNode === undefined) {
    return $node => {
      $node.remove()
      return undefined
    }
  }

  // 如果傳進來的節點是字串
  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    // 如果字串有改變，就回傳掛載函式 (舊字串 => 新字串)
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = render(vNewNode)
        return mount($newNode, $node)
      }
      // 如果字串沒有改變，就回傳一樣的節點
    } else {
      return $node => $node
    }
  }

  // 如果新舊節點標籤不一樣，則新節點取代舊節點
  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode)
      return mount($newNode, $node)
    }
  }

  // 比較新舊節點的屬性，
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children)

  return $node => {
    patchAttrs($node)
    patchChildren($node)
    return $node
  }
}

// 這邊也都是回傳函式
const diffAttrs = function (oldAttrs, newAttrs) {
  // 儲存屬性變動的 patch 函式
  const patches = []

  // 新增 "設定新屬性的函式" 到 patches 陣列
  for (const key in newAttrs) {
    patches.push($node => {
      $node.setAttribute(key, newAttrs[key])
      return $node
    })
  }

  // 如果 "沒有" 舊屬性在新屬性上，就新增 "移除舊屬性函式" 到 patches 陣列
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(key)
        return $node
      })
    }
  }

  // 回傳更新函式，這個函式會執行在 patches 陣列裡每個函式
  return $node => {
    patches.forEach(patch => {
      patch($node)
    })
  }
}

const diffChildren = function (oldVChildren, newVChildren) {
  //
  const childPatches = []
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]))
  })

  //
  const additionalPatches = []
  newVChildren.slice(oldVChildren.length).forEach(additionalVChild => {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalVChild))
      return $node
    })
  })

  //
  return $node => {
    //
    for (let i = childPatches.length - 1; i >= 0; i--) {
      const $child = $node.childNodes[i]
      const patch = childPatches[i]
      patch($child)
    }

    //
    additionalPatches.forEach(patch => {
      patch($node)
    })

    return $node
  }

}

export default diff