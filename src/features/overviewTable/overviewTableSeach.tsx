import { FC } from "react"
import { Box, TextInput as MantineTextInput } from "@mantine/core"
import styled from "styled-components"

const TextInput = styled(MantineTextInput)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

type OverviewProps = {
  value: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

const OverviewTableSeach: FC<OverviewProps> = ({
  value,
  onChange,
  onSubmit,
}) => (
  <Box>
    <TextInput
      value={value}
      onChange={({ target: { value } }) => {
        if (onChange) onChange(value)
      }}
      style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
      onSubmit={({ currentTarget: { value } }) => {
        if (onSubmit) onSubmit(value)
      }}
      styles={{ input: { padding: "8px" } }}
      placeholder="Search..."
    />
  </Box>
)

export default OverviewTableSeach
