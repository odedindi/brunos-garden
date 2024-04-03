import type { FC } from "react"
import { IconChevronRight } from "@tabler/icons-react"
import Icon, { IconProps } from "./Icon"

interface ChevronIconProps extends IconProps {
  up?: boolean
  down?: boolean
  left?: boolean
}

const ChevronIcon: FC<ChevronIconProps> = ({ up, down, left, ...props }) => (
  <Icon {...props}>
    <IconChevronRight
      stroke={1.5}
      style={{
        transform: `rotate(${down ? 90 : left ? 180 : up ? 270 : 0}deg)`,
      }}
    />
  </Icon>
)

export default ChevronIcon
