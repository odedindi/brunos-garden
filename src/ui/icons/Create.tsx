import { FC } from "react"

import { IconPlus } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const CreateIcon: FC<Omit<IconProps, "label">> = (props) => (
  <Icon label="Create" {...props}>
    <IconPlus stroke={1.5} />
  </Icon>
)

export default CreateIcon
