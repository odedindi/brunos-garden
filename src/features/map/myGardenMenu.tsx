import type { FC } from "react"
import AdjustmentsIcon from "@/ui/icons/Adjustments"
import {
  Menu,
  type MenuProps,
  Button,
  Slider,
  Switch,
  ColorPicker,
  AlphaSlider,
} from "@mantine/core"
import { IconGardenCart, IconSettingsPin } from "@tabler/icons-react"

const radiusSliderMarks = [
  { value: 10, label: "xs" },
  { value: 30, label: "sm" },
  { value: 50, label: "md" },
  { value: 75, label: "lg" },
  { value: 90, label: "xl" },
]

type FieldColor = {
  id: string
  fillColor: [number, number, number]
  rgba: string
}

export const fieldColors: FieldColor[] = [
  { id: "pink", fillColor: [237, 5, 201], rgba: "rgba(237, 5, 201, 120)" }, // pink
  {
    id: "green",
    fillColor: [178, 183, 111],
    rgba: "rgba(178, 183, 111, 120)",
  }, // green
  {
    id: "purple",
    fillColor: [133, 105, 241],
    rgba: "rgba(133, 105, 241, 120)",
  }, // purple
  { id: "grey", fillColor: [67, 79, 71], rgba: "rgba(67, 79, 71, 120)" }, // grey
  { id: "red", fillColor: [196, 81, 53], rgba: "rgba(196, 81, 53, 120)" }, // red
  {
    id: "blue",
    fillColor: [13, 226, 235],
    rgba: "rgba(13, 226, 235, 120)",
  }, // blue
  {
    id: "lime",
    fillColor: [121, 226, 11],
    rgba: "rgba(121, 226, 11, 120)",
  }, // lime
  {
    id: "yellow",
    fillColor: [182, 213, 66],
    rgba: "rgba(182, 213, 66, 120)",
  }, // yellow
  { id: "navy", fillColor: [5, 56, 126], rgba: "rgba(5, 56, 126, 120)" }, // navy
  {
    id: "orange",
    fillColor: [226, 171, 14],
    rgba: "rgba(226, 171, 14, 120)",
  }, // orange
  { id: "teal", fillColor: [0, 128, 128], rgba: "rgba(0, 128, 128, 120)" }, // teal
  { id: "gold", fillColor: [255, 215, 0], rgba: "rgba(255, 215, 0, 120)" }, // gold
  {
    id: "silver",
    fillColor: [192, 192, 192],
    rgba: "rgba(192, 192, 192, 120)",
  }, // silver
  { id: "maroon", fillColor: [128, 0, 0], rgba: "rgba(128, 0, 0, 120)" }, // maroon
]

interface MyGardenMenuProps extends Omit<MenuProps, "children"> {
  disabled?: boolean
  toMyGarden?: () => void
  gardenVisible?: boolean
  setGardenVisible?: (visible: boolean) => void

  onMarkMyGarden?: () => void
  isMarkingMyGarden?: boolean
}
const MyGardenMenu: FC<MyGardenMenuProps> = ({
  toMyGarden,
  gardenVisible = false,
  setGardenVisible,

  onMarkMyGarden,
  isMarkingMyGarden,
  disabled,
  shadow = "md",
  openDelay = 100,
  closeDelay = 250,
  closeOnItemClick = false,
  position = "left-start",
  ...props
}) => {
  return (
    <Menu
      shadow={shadow}
      openDelay={openDelay}
      closeDelay={closeDelay}
      closeOnItemClick={closeOnItemClick}
      position={position}
      withArrow
      {...props}
    >
      <Menu.Target>
        <Button variant="subtle" h="min-content" p={0} component="span">
          <AdjustmentsIcon
            disabled={disabled}
            size="md"
            label="My Garden Settings"
            bg="dark.2"
          />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Garden Settings</Menu.Label>

        <Menu.Item disabled={!toMyGarden} onClick={toMyGarden} closeMenuOnClick>
          Take me To My Garden
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Show Garden</Menu.Label>
        <Menu.Item
          disabled={gardenVisible === undefined || !setGardenVisible}
          rightSection={<IconGardenCart />}
        >
          <Switch
            checked={gardenVisible}
            onChange={(event) =>
              setGardenVisible?.(event.currentTarget.checked)
            }
          />
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          disabled={!onMarkMyGarden}
          onClick={onMarkMyGarden}
          rightSection={<IconSettingsPin />}
          closeMenuOnClick
          style={{
            background: isMarkingMyGarden
              ? "var(--mantine-color-gray-2)"
              : undefined,
          }}
        >
          Set Garden Position
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
export default MyGardenMenu
