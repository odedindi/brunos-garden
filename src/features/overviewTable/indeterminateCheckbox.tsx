import { Checkbox, CheckboxProps } from "@mantine/core"
import { FC, useEffect, useRef } from "react"

const IndeterminateCheckbox: FC<
  { indeterminate?: boolean } & Omit<CheckboxProps, "styles">
> = ({ indeterminate, color = "dark.3", ...rest }) => {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate])

  return (
    <Checkbox
      ref={ref}
      color={color}
      styles={{ input: { cursor: "pointer" } }}
      {...rest}
    />
  )
}

export default IndeterminateCheckbox
