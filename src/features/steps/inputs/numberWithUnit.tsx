import { FC, useMemo, useRef } from "react"

import { NumberInput, Select, Text, Box } from "@mantine/core"
import SubmitButton from "./submitButton"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"
import classes from "./input.module.css"

const weight = ["g", "kg"] as const
export type Weight = (typeof weight)[number]
const area = ["m2"] as const
export type Area = (typeof area)[number]
export type Unit = Weight | Area

const SelectNumberWithUnit: FC<{
  value?: number
  onChange: (value: number | undefined) => void
  unit: Unit
  onUnitChange: (unit: Unit) => void
  onSubmit?: () => void
  placeholder?: string
  focusOnLoad?: boolean
}> = ({
  focusOnLoad,
  value,
  onChange,
  unit,
  onUnitChange,
  onSubmit,
  placeholder,
}) => {
  const data = useMemo(
    () => Array.from(area.includes(unit as Area) ? area : weight),
    [unit],
  )
  const ref = useRef<HTMLInputElement>(null)
  useFocusOnLoad<"input">(focusOnLoad ? ref : undefined)

  return (
    <NumberInput
      className={classes.input}
      ref={ref}
      value={value}
      onChange={(value) => {
        const num = Number(value)
        if (num) onChange(num)
      }}
      rightSectionWidth={40}
      placeholder={placeholder}
      rightSection={
        <Box className={classes.selectUnitWrapper}>
          <Select
            data={data}
            onChange={(unit) => {
              if (unit) onUnitChange(unit as Unit)
              ref.current?.focus()
            }}
            allowDeselect={false}
            defaultValue={unit}
            rightSection={<Text>{unit}</Text>}
            withCheckIcon={false}
            classNames={{
              input: classes.selectUnitInput,
              dropdown: classes.selectUnitDropdown,
            }}
            onBlur={() => ref.current?.focus()}
          />
          <SubmitButton onClick={onSubmit} />
        </Box>
      }
      onKeyDown={(event) => {
        if (event.key === "Enter") onSubmit?.()
      }}
    />
  )
}

export default SelectNumberWithUnit
