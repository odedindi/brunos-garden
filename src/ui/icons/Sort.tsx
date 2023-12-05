import { FC } from "react"

import { IconArrowsSort } from "@tabler/icons-react"

import Icon, { IconProps } from "./Icon"

const SortIcon: FC<Omit<IconProps, "label">> = (props) => (
  <Icon label="Sort" {...props}>
    <IconArrowsSort stroke={1.5} />
  </Icon>
)

export default SortIcon
