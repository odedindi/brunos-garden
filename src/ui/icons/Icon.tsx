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

export type IconProps = PropsWithChildren<{
  onClick?: () => void
  label?: string
  size?: ActionIconProps["size"]
  bg?: ActionIconProps["bg"]
  disabled?: ActionIconProps["disabled"]
  style?: CSSProperties
}>

const Icon: FC<IconProps> = ({
  label,
  size = "xs",
  bg = "dark.3",
  ...iconProps
}) =>
  label ? (
    <Tooltip openDelay={500} label={label}>
      <StyledActionIcon size={size} bg={bg} {...iconProps} />
    </Tooltip>
  ) : (
    <StyledActionIcon size={size} bg={bg} {...iconProps} />
  )

export default Icon
