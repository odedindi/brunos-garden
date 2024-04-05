import type { FC } from "react"
import { IconSettings } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const SettingsIcon: FC<IconProps> = ({ label = "Settings", ...props }) => (
  <Icon label={label} {...props}>
    <IconSettings stroke={1.5} />
  </Icon>
)

export default SettingsIcon
