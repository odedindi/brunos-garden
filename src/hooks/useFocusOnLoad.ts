import { useEffect } from "react"

export const useFocusOnLoad = (ref?: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    ref?.current?.focus()
  }, [])
}
