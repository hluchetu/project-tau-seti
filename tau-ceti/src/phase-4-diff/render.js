export function render(node, container) {
  if (node == null || typeof node === 'boolean') {
    return
  }

  if (Array.isArray(node)) {
    node.forEach((child) => render(child, container))
    return
  }

  if (typeof node === 'string' || typeof node === 'number') {
    container.appendChild(document.createTextNode(String(node)))
    return
  }

  const element = document.createElement(node.type)
  const { children = [], ...props } = node.props || {}

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue

    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase()
      element.addEventListener(eventName, value)
    } else {
      element.setAttribute(key, value)
    }
  }

  children.forEach((child) => render(child, element))
  container.appendChild(element)
}
