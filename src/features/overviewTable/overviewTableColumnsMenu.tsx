import { Harvest } from "@/types/Harvest"
import SettingsIcon from "@/ui/icons/Settings"
import { Menu, Button, Checkbox, MenuProps } from "@mantine/core"

import { Table as TanstackTable } from "@tanstack/react-table"
import { FC } from "react"

interface OverviewTableColumnsMenuProps extends Omit<MenuProps, "children"> {
  table: TanstackTable<Harvest>
  disabled?: boolean
}

const OverviewTableColumnsMenu: FC<OverviewTableColumnsMenuProps> = ({
  table,
  disabled,
  shadow = "md",
  openDelay = 100,
  closeDelay = 250,
  closeOnItemClick = false,
  position = "left-start",
  ...props
}) => (
  <Menu
    shadow={shadow}
    openDelay={openDelay}
    closeDelay={closeDelay}
    closeOnItemClick={closeOnItemClick}
    position={position}
    {...props}
  >
    <Menu.Target>
      <Button variant="subtle" h="100%" p={0}>
        <SettingsIcon disabled={disabled} size="md" />
      </Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Select Columns</Menu.Label>
      {table.getAllLeafColumns().map((column) => {
        if (column.id === "select") return null
        const checked = column.getIsVisible()
        const onClick = () => column.toggleVisibility(!checked)
        return (
          <Menu.Item
            key={column.id}
            onClick={onClick}
            style={{ textTransform: "capitalize" }}
            leftSection={
              <Checkbox
                {...{
                  checked: column.getIsVisible(),
                  onChange: onClick,
                  title: column.id,
                  color: "dark.3",
                }}
              />
            }
          >
            {column.id.split("_")[0]}
          </Menu.Item>
        )
      })}
    </Menu.Dropdown>
  </Menu>
)

export default OverviewTableColumnsMenu
