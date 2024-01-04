import { RefObject, useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

/**
 * Hook, that returns the current dimensions of an HTML element.
 * @param ref - React ref object, that is used to observe the element.
 * @returns The dimensions of the element.
 */

const useResizeObserver = (ref: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null)
  useEffect(() => {
    const currentRef = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) setDimensions(entry.contentRect)
    })
    if (currentRef) resizeObserver.observe(currentRef)
    return () => {
      if (currentRef) resizeObserver.unobserve(currentRef)
    }
  }, [ref])
  return dimensions
}

export default useResizeObserver
