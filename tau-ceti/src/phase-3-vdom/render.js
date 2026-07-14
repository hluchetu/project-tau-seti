export function render(node, container) {
  if (typeof node === "string" || typeof node === "number") {
    container.appendChild(document.createTextNode(node));
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      render(item, container);
    }
    return;
  }

  const el = document.createElement(node.type);

  for (const [key, value] of Object.entries(node.props)) {
    if (key === "children") continue;

    if (key.startsWith("on")) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
      continue;
    }

    el.setAttribute(key, value);
  }

  for (const child of node.props.children) {
    render(child, el);
  }

  container.appendChild(el);
}
