import type { FC } from "react"
import { IconPlus } from "@tabler/icons-react"
import Icon, { type IconProps } from "./Icon"

const CreateIcon: FC<IconProps> = ({ label = "Create", ...props }) => (
  <Icon label={label} {...props}>
    <IconPlus stroke={1.5} />
  </Icon>
)

export default CreateIcon
