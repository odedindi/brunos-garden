import type { FC } from "react"
import { IconMap } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const MapIcon: FC<IconProps> = ({ label = "Map", ...props }) => (
  <Icon label={label} {...props}>
    <IconMap stroke={1.5} />
  </Icon>
)

export default MapIcon
