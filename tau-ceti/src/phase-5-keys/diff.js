import { render } from './render.js'

function isTextNode(node) {
  return typeof node === 'string' || typeof node === 'number'
}

function setProp(domNode, key, value, oldValue) {
  if (key === 'children' || key === 'key') return

  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase()
    if (oldValue) domNode.removeEventListener(eventName, oldValue)
    domNode.addEventListener(eventName, value)
  } else if (value == null) {
    domNode.removeAttribute(key)
  } else {
    domNode.setAttribute(key, value)
  }
}

function removeProp(domNode, key, value) {
  if (key === 'children' || key === 'key') return

  if (key.startsWith('on') && typeof value === 'function') {
    domNode.removeEventListener(key.slice(2).toLowerCase(), value)
  } else {
    domNode.removeAttribute(key)
  }
}

function patchProps(domNode, oldProps = {}, newProps = {}) {
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)])

  for (const key of allKeys) {
    if (key === 'children' || key === 'key') continue

    const oldValue = oldProps[key]
    const newValue = newProps[key]
    if (newValue === oldValue) continue

    if (newValue == null) removeProp(domNode, key, oldValue)
    else setProp(domNode, key, newValue, oldValue)
  }
}

function getKey(node) {
  return node?.props?.key
}

function patchChildren(domNode, oldChildren = [], newChildren = []) {
  // Only use keys when every child in the list has one.
  const allChildrenAreKeyed = [...oldChildren, ...newChildren].every((child) => getKey(child) != null)
  if (!allChildrenAreKeyed) {
    const commonLength = Math.min(oldChildren.length, newChildren.length)

    for (let index = 0; index < commonLength; index += 1) {
      patch(domNode.childNodes[index], oldChildren[index], newChildren[index])
    }

    for (let index = commonLength; index < newChildren.length; index += 1) {
      render(newChildren[index], domNode)
    }

    for (let index = oldChildren.length - 1; index >= newChildren.length; index -= 1) {
      domNode.childNodes[index].remove()
    }
    return
  }

  // Save each old task using its key so we can find it after it moves.
  const oldByKey = new Map()

  oldChildren.forEach((oldChild, index) => {
    const key = getKey(oldChild)
    if (oldByKey.has(key)) {
      throw new Error(`Duplicate key: ${key}`)
    }
    oldByKey.set(key, { oldChild, domNode: domNode.childNodes[index] })
  })

  const claimedKeys = new Set()

  newChildren.forEach((newChild, index) => {
    const key = getKey(newChild)
    if (claimedKeys.has(key)) {
      throw new Error(`Duplicate key: ${key}`)
    }
    claimedKeys.add(key)

    const match = oldByKey.get(key) // Check if this task was already on the screen.
    if (match) {
      const patchedDomNode = patch(match.domNode, match.oldChild, newChild)
      const nodeAtPosition = domNode.childNodes[index]
      // Move the same DOM node instead of making another one.
      if (patchedDomNode !== nodeAtPosition) {
        domNode.insertBefore(patchedDomNode, nodeAtPosition || null)
      }
    } else {
      // There is no old task with this key, so make a new one.
      const wrapper = document.createElement('div')
      render(newChild, wrapper)
      domNode.insertBefore(wrapper.firstChild, domNode.childNodes[index] || null)
    }
  })

  oldByKey.forEach(({ domNode: oldDomNode }, key) => {
    // If an old key was not used, that task was deleted.
    if (!claimedKeys.has(key)) oldDomNode.remove()
  })
}

function replaceNode(domNode, newNode) {
  const wrapper = document.createElement('div')
  render(newNode, wrapper)
  const replacement = wrapper.firstChild
  domNode.replaceWith(replacement)
  return replacement
}

export function patch(domNode, oldNode, newNode) {
  if (oldNode === newNode) return domNode

  if (isTextNode(oldNode) && isTextNode(newNode)) {
    if (oldNode !== newNode) domNode.textContent = String(newNode)
    return domNode
  }

  if (isTextNode(oldNode) || isTextNode(newNode) || oldNode.type !== newNode.type) {
    return replaceNode(domNode, newNode)
  }

  patchProps(domNode, oldNode.props, newNode.props)
  patchChildren(domNode, oldNode.props?.children ?? [], newNode.props?.children ?? [])
  return domNode
}
