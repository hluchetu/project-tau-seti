// This array keeps state values between renders.
let hooksArray = []

// This tells us which state slot the current hook should use.
let currentHookIndex = 0

let rerenderRoot = () => {}

// Start counting hooks from slot 0 every time App renders.
export function prepareToRender() {
  currentHookIndex = 0
}

export function registerRootRerender(callback) {
  rerenderRoot = callback
}

export function myUseState(initialValue) {
  const hookSlot = currentHookIndex

  if (hooksArray[hookSlot] === undefined) {
    hooksArray[hookSlot] = initialValue
  }

  // The setter remembers this hook's slot number.
  const setValue = (nextValue) => {
    const previousValue = hooksArray[hookSlot]

    hooksArray[hookSlot] = typeof nextValue === 'function'
      ? nextValue(previousValue)
      : nextValue

    console.log('Hook slots:', hooksArray)
    rerenderRoot()
  }

  const value = hooksArray[hookSlot]
  currentHookIndex += 1
  return [value, setValue]
}

// Only for learning: lets us show the hook slots on the page.
export function getHookSnapshot() {
  return hooksArray.map((value, slot) => ({ slot, value: String(value) }))
}
