import type { FC } from "react"
import { IconEdit } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const EditIcon: FC<IconProps> = ({ label = "Edit", ...props }) => (
  <Icon label={label} {...props}>
    <IconEdit stroke={1.5} />
  </Icon>
)

export default EditIcon
