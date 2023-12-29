import { FC } from "react"

import { IconTrash } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const TrashIcon: FC<
  IconProps & { up?: boolean; down?: boolean; left?: boolean }
> = ({ up, down, left, ...props }) => (
  <Icon {...props}>
    <IconTrash
      stroke={1.5}
      style={{
        transform: `rotate(${down ? 90 : left ? 180 : up ? 270 : 0}deg)`,
      }}
    />
  </Icon>
)

export default TrashIcon
