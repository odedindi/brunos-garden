import { FC } from "react"

import { IconRepeat } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const RefreshIcon: FC<Omit<IconProps, "label">> = (props) => (
  <Icon label="Refresh" {...props}>
    <IconRepeat stroke={1.5} />
  </Icon>
)

export default RefreshIcon
