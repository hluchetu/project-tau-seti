// JSX starts in phase 3, so later JSX phases reuse this factory.
export function customCreateElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
