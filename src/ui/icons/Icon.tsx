import { CSSProperties, FC, PropsWithChildren } from "react"
import {
  ActionIcon,
  ActionIconProps,
  Tooltip,
  Loader,
  DefaultMantineColor,
} from "@mantine/core"
import classes from "./Icon.module.css"

export interface IconProps
  extends Pick<
    ActionIconProps,
    "size" | "bg" | "disabled" | "style" | "color"
  > {
  onClick?: () => void
  label?: string
  loading?: boolean
}

const Icon: FC<PropsWithChildren<IconProps>> = ({
  onClick,
  label,
  size = "xs",
  bg = "dark.3",
  color,
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
        color={color}
      >
        {loading ? <Loader size={size} color={color} /> : children}
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
      color={color}
      style={style}
    >
      {children}
    </ActionIcon>
  )

export default Icon
