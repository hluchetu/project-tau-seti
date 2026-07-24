// This is the Phase 5 renderer: it turns virtual DOM objects into real DOM nodes.
export function render(node, container) {
  if (node == null || typeof node === 'boolean') return

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
    // A key identifies a virtual DOM item; it is not an HTML attribute.
    if (key === 'key') continue

    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value)
    } else {
      element.setAttribute(key, value)
    }
  }

  children.forEach((child) => render(child, element))
  container.appendChild(element)
}
