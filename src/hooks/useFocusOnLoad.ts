import { RefObject, useEffect } from "react"

export const useFocusOnLoad = <T extends keyof HTMLElementTagNameMap = "div">(
  ref?: RefObject<HTMLElementTagNameMap[T]>,
  callback?: (ref?: RefObject<HTMLElementTagNameMap[T]>) => void,
) => {
  useEffect(() => {
    callback ? callback(ref) : ref?.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
