import type { FC } from "react"
import { IconChevronsRight } from "@tabler/icons-react"
import Icon from "./Icon"
import type { ChevronIconProps } from "./Chevron"

const ChevronsIcon: FC<ChevronIconProps> = ({ up, down, left, ...props }) => (
  <Icon {...props}>
    <IconChevronsRight
      stroke={1.5}
      style={{
        transform: `rotate(${down ? 90 : left ? 180 : up ? 270 : 0}deg)`,
      }}
    />
  </Icon>
)

export default ChevronsIcon
