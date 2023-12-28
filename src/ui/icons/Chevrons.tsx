import { FC } from "react"

import { IconChevronsRight } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const ChevronsIcon: FC<
  IconProps & { up?: boolean; down?: boolean; left?: boolean }
> = ({ up, down, left, ...props }) => (
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
