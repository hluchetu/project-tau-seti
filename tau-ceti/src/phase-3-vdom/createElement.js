export function customCreateElement(type, props, ...children) {

  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
