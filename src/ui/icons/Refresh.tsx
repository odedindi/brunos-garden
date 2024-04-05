import type { FC } from "react"
import { IconRepeat } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const RefreshIcon: FC<IconProps> = ({ label = "Refresh", ...props }) => (
  <Icon label={label} {...props}>
    <IconRepeat stroke={1.5} />
  </Icon>
)

export default RefreshIcon
