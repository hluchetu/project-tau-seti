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

// JSX map() creates an array wrapper that has no matching browser DOM node.
function normalizeChildren(children) {
  return children.flat(Infinity).filter((child) => child != null && typeof child !== 'boolean')
}

function patchChildren(domNode, oldChildren = [], newChildren = []) {
  const oldNodes = normalizeChildren(oldChildren)
  const newNodes = normalizeChildren(newChildren)
  const allChildrenAreKeyed = [...oldNodes, ...newNodes].every((child) => getKey(child) != null)

  if (!allChildrenAreKeyed) {
    const commonLength = Math.min(oldNodes.length, newNodes.length)
    for (let index = 0; index < commonLength; index += 1) {
      patch(domNode.childNodes[index], oldNodes[index], newNodes[index])
    }
    for (let index = commonLength; index < newNodes.length; index += 1) {
      render(newNodes[index], domNode)
    }
    for (let index = oldNodes.length - 1; index >= newNodes.length; index -= 1) {
      domNode.childNodes[index].remove()
    }
    return
  }

  // This is Phase 5's keyed-child behavior, kept for later phases.
  const oldByKey = new Map()
  oldNodes.forEach((oldChild, index) => oldByKey.set(getKey(oldChild), {
    oldChild,
    domNode: domNode.childNodes[index],
  }))

  const claimedKeys = new Set()
  newNodes.forEach((newChild, index) => {
    const key = getKey(newChild)
    claimedKeys.add(key)
    const match = oldByKey.get(key)

    if (match) {
      const patchedNode = patch(match.domNode, match.oldChild, newChild)
      if (patchedNode !== domNode.childNodes[index]) {
        domNode.insertBefore(patchedNode, domNode.childNodes[index] || null)
      }
    } else {
      const wrapper = document.createElement('div')
      render(newChild, wrapper)
      domNode.insertBefore(wrapper.firstChild, domNode.childNodes[index] || null)
    }
  })

  oldByKey.forEach(({ domNode: oldDomNode }, key) => {
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

// Compare the old tree with the new tree and update only the changed DOM nodes.
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
