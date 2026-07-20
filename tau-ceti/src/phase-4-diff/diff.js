import { render } from './render.js'

function isTextNode(node) {
  return typeof node === 'string' || typeof node === 'number'
}

function setProp(domNode, key, value, oldValue) {
  if (key === 'children') return

  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase()
    if (oldValue) {
      domNode.removeEventListener(eventName, oldValue)
    }
    domNode.addEventListener(eventName, value)
  } else if (value == null) {
    domNode.removeAttribute(key)
  } else {
    domNode.setAttribute(key, value)
  }
}

function removeProp(domNode, key, value) {
  if (key === 'children') return

  if (key.startsWith('on') && typeof value === 'function') {
    domNode.removeEventListener(key.slice(2).toLowerCase(), value)
  } else {
    domNode.removeAttribute(key)
  }
}

function patchProps(domNode, oldProps = {}, newProps = {}) {
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)])

  for (const key of allKeys) {
    if (key === 'children') continue

    const oldValue = oldProps[key]
    const newValue = newProps[key]

    if (newValue !== oldValue) {
      if (newValue == null) {
        removeProp(domNode, key, oldValue)
      } else {
        setProp(domNode, key, newValue, oldValue)
      }
    }
  }
}

function patchChildren(domNode, oldChildren = [], newChildren = []) {
  const oldLength = oldChildren.length
  const newLength = newChildren.length
  const commonLength = Math.min(oldLength, newLength)

  for (let i = 0; i < commonLength; i += 1) {
    patch(domNode.childNodes[i], oldChildren[i], newChildren[i])
  }

  if (newLength > oldLength) {
    for (let i = oldLength; i < newLength; i += 1) {
      render(newChildren[i], domNode)
    }
  } else if (oldLength > newLength) {
    for (let i = oldLength - 1; i >= newLength; i -= 1) {
      domNode.removeChild(domNode.childNodes[i])
    }
  }
}

function replaceNode(domNode, newNode) {
  const wrapper = document.createElement('div')
  render(newNode, wrapper)
  domNode.replaceWith(wrapper.firstChild)
}

export function patch(domNode, oldNode, newNode) {
  if (oldNode === newNode) return

  if (isTextNode(oldNode) && isTextNode(newNode)) {
    if (oldNode !== newNode) {
      domNode.textContent = String(newNode)
    }
    return
  }

  if (isTextNode(oldNode) || isTextNode(newNode) || oldNode.type !== newNode.type) {
    // replace the whole subtree when types differ
    replaceNode(domNode, newNode)
    return
  }

  patchProps(domNode, oldNode.props, newNode.props)
  patchChildren(domNode, oldNode.props?.children ?? [], newNode.props?.children ?? [])
}
