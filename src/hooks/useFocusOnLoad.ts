import { useEffect } from "react"

export const useFocusOnLoad = (ref?: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    ref?.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
