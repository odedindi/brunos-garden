import { FC } from "react"
import { Box, TextInput } from "@mantine/core"
import classes from "./overviewTable.module.css"
import cx from "clsx"

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
      className={cx(classes.input, classes.searchInput)}
      value={value}
      onChange={({ target: { value } }) => onChange?.(value)}
      onSubmit={({ currentTarget: { value } }) => onSubmit?.(value)}
      placeholder="Search..."
    />
  </Box>
)

export default OverviewTableSeach
