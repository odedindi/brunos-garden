import type { FC } from "react"
import MapIcon from "@/ui/icons/Map"
import { Menu, Button, Checkbox, MenuProps } from "@mantine/core"

type MapStyle = {
  label: string
  url: string
}

export const mapStyles: MapStyle[] = [
  {
    label: "satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  // { label: "satellite", url: "mapbox://styles/mapbox/satellite-v9" },
  { label: "standard", url: "mapbox://styles/mapbox/standard" },
  // { label: "streets", url: "mapbox://styles/mapbox/streets-v12" },
  { label: "outdoor", url: "mapbox://styles/mapbox/outdoors-v12" },
]

interface MapStyleMenuProps extends Omit<MenuProps, "children" | "onChange"> {
  activeMapStyle: number
  onChange: (mapStyleUrl: number) => void
  disabled?: boolean
}
const MapStyleMenu: FC<MapStyleMenuProps> = ({
  activeMapStyle,
  onChange,
  disabled,
  shadow = "md",
  openDelay = 100,
  closeDelay = 250,
  closeOnItemClick = true,
  position = "left-start",
  ...props
}) => (
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
        <MapIcon disabled={disabled} size="md" label="Select Map" bg="dark.2" />
      </Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Select Map</Menu.Label>
      {mapStyles.map((mapStyle, i) => {
        const onClick = () => onChange(i)
        return (
          <Menu.Item
            key={mapStyle.label}
            onClick={onClick}
            style={{ textTransform: "capitalize" }}
            leftSection={
              <Checkbox
                {...{
                  checked: i === activeMapStyle,
                  onChange: onClick,
                  title: mapStyle.label,
                  color: "dark.3",
                }}
              />
            }
          >
            {mapStyle.label}
          </Menu.Item>
        )
      })}
    </Menu.Dropdown>
  </Menu>
)

export default MapStyleMenu
