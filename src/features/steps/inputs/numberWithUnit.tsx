import { FC, useMemo, useRef } from "react"

import {
  Flex,
  NumberInput as MantineNumberInput,
  Select,
  Text,
} from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"
import styled from "styled-components"

const weight = ["g", "kg"] as const
export type Weight = (typeof weight)[number]
const area = ["m2"] as const
export type Area = (typeof area)[number]
export type Unit = Weight | Area

const NumberInput = styled(MantineNumberInput)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

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
      ref={ref}
      value={value}
      onChange={(value) => {
        if (Number(value)) onChange(Number(value))
      }}
      rightSectionWidth={40}
      placeholder={placeholder}
      rightSection={
        <Flex
          gap="xs"
          justify="center"
          align="center"
          direction="row"
          wrap="nowrap"
          pos="relative"
          right={32}
        >
          <Select
            data={data}
            onChange={(unit) => {
              if (unit) onUnitChange(unit as Unit)
              if (ref.current) ref.current.focus()
            }}
            allowDeselect={false}
            defaultValue={unit}
            rightSection={<Text>{unit}</Text>}
            withCheckIcon={false}
            styles={{
              input: { backgroundColor: "transparent", border: "none" },
            }}
            onBlur={() => {
              if (ref.current) ref.current.focus()
            }}
          />
          <ChevronIcon
            onClick={() => {
              if (onSubmit) onSubmit()
            }}
          />
        </Flex>
      }
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (onSubmit) onSubmit()
        }
      }}
    />
  )
}

export default SelectNumberWithUnit
