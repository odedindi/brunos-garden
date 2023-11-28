import { CSSProperties, FC, PropsWithChildren } from "react"

import { styled } from "styled-components"
import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core"

import { get } from "lodash"

const StyledActionIcon = styled(ActionIcon)`
  color: ${({ theme }) => get(theme, "colors.gray[3]")};
  transition: color 0.3s ease-out;
  :hover {
    color: ${({ theme }) => get(theme, "colors.gray[1]")};
  }
`

export type IconProps = {
  onClick?: () => void
  label?: string
  size?: ActionIconProps["size"]
  bg?: ActionIconProps["bg"]
  style?: CSSProperties
}

const Icon: FC<PropsWithChildren<IconProps>> = ({
  label,
  size = "xs",
  bg = "dark.3",
  ...iconProps
}) => (
  <Tooltip openDelay={2500} label={label}>
    <StyledActionIcon size={size} bg={bg} {...iconProps} />
  </Tooltip>
)

export default Icon
