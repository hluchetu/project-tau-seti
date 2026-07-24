// Phase 3 starts the rendered JSX app, so later live phases reuse this factory.
export function customCreateElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
