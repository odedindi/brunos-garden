import type { FC } from "react"
import { IconAdjustments } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const AdjustmentsIcon: FC<IconProps> = ({
  label = "Adjustments",
  ...props
}) => (
  <Icon label={label} {...props}>
    <IconAdjustments stroke={1.5} />
  </Icon>
)

export default AdjustmentsIcon
