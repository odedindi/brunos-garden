import { Checkbox as MantineCheckbox, CheckboxProps } from "@mantine/core"
import { FC, useEffect, useRef } from "react"
import styled from "styled-components"

const Checkbox = styled(MantineCheckbox)`
  cursor: pointer;
`

const IndeterminateCheckbox: FC<
  { indeterminate?: boolean } & CheckboxProps
> = ({ indeterminate, className = "", ...rest }) => {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate])

  return <Checkbox ref={ref} {...rest} />
}

export default IndeterminateCheckbox
