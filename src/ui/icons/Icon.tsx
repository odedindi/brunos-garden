import { CSSProperties, FC, PropsWithChildren } from "react"
import {
  ActionIcon,
  ActionIconProps,
  Tooltip,
  Loader,
  DefaultMantineColor,
} from "@mantine/core"
import classes from "./Icon.module.css"

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
  onClick,
  label,
  size = "xs",
  bg = "dark.3",
  disabled,
  style,
  loading,
  children,
}) =>
  label ? (
    <Tooltip openDelay={500} label={label}>
      <ActionIcon
        className={classes.icon}
        onClick={() => {
          if (onClick) onClick()
        }}
        size={size}
        bg={bg}
        disabled={disabled}
        style={style}
      >
        {loading ? <Loader size={size} /> : children}
      </ActionIcon>
    </Tooltip>
  ) : loading ? (
    <Loader size={size} color={bg as DefaultMantineColor} />
  ) : (
    <ActionIcon
      className={classes.icon}
      onClick={() => {
        if (onClick) onClick()
      }}
      size={size}
      bg={bg}
      disabled={disabled}
      style={style}
    >
      {children}
    </ActionIcon>
  )

export default Icon
