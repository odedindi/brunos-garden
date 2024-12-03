import type { FC } from "react"
import { IconTrash } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const TrashIcon: FC<IconProps> = ({ ...props }) => (
  <Icon {...props}>
    <IconTrash stroke={1.5} />
  </Icon>
)

export default TrashIcon
