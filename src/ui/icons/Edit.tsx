import { FC } from "react"

import { IconEdit } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const EditIcon: FC<Omit<IconProps, "label">> = (props) => (
  <Icon label="Edit" {...props}>
    <IconEdit stroke={1.5} />
  </Icon>
)

export default EditIcon
