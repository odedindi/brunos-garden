import type { FC } from "react"
import { IconArrowsSort } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const SortIcon: FC<IconProps> = ({ label = "Sort", ...props }) => (
  <Icon label={label} {...props}>
    <IconArrowsSort stroke={1.5} />
  </Icon>
)

export default SortIcon
