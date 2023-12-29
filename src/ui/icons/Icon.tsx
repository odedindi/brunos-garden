import { CSSProperties, FC, PropsWithChildren } from "react"

import { styled } from "styled-components"
import {
  ActionIcon,
  ActionIconProps,
  Tooltip,
  Loader,
  DefaultMantineColor,
} from "@mantine/core"

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
  loading?: boolean
}>

const Icon: FC<IconProps> = ({
  label,
  size = "xs",
  bg = "dark.3",
  loading,
  children,
  ...iconProps
}) =>
  label ? (
    <Tooltip openDelay={500} label={label}>
      <StyledActionIcon size={size} bg={bg} {...iconProps}>
        {loading ? <Loader size={size} /> : children}
      </StyledActionIcon>
    </Tooltip>
  ) : loading ? (
    <Loader size={size} color={bg as DefaultMantineColor} />
  ) : (
    <StyledActionIcon size={size} bg={bg} {...iconProps}>
      {children}
    </StyledActionIcon>
  )

export default Icon
