import { FC, useMemo } from "react"

import { Flex, NumberInput, Select, Text } from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"

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
}> = ({ value, onChange, unit, onUnitChange, onSubmit, placeholder }) => {
  const data = useMemo(
    () => Array.from(area.includes(unit as Area) ? area : weight),
    [unit],
  )
  return (
    <NumberInput
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
            }}
            allowDeselect={false}
            defaultValue={unit}
            rightSection={<Text>{unit}</Text>}
            withCheckIcon={false}
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
