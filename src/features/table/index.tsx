import { FC, useMemo, useState } from "react"

import { Checkbox, Table } from "@mantine/core"
import { Task } from "@/types/Task"

type TaskKey = keyof Task

const OverviewTable: FC<{ tasks?: Task[] }> = ({ tasks }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const tasksKeys = useMemo(
    () => Object.keys(tasks?.[0] ?? {}).filter((key) => key !== "id"),
    [tasks],
  )

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          {tasksKeys.length ? (
            <>
              <Table.Th />
              {tasksKeys.map((key, i) => (
                <Table.Th key={i} style={{ textTransform: "capitalize" }}>
                  {key}
                </Table.Th>
              ))}
            </>
          ) : null}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tasksKeys.length
          ? tasks?.map((task) => {
              const onClick = () =>
                setSelectedRows(
                  !selectedRows.includes(task.id)
                    ? [...selectedRows, task.id]
                    : selectedRows.filter((id) => id !== task.id),
                )
              return (
                <Table.Tr
                  key={task.id}
                  bg={selectedRows.includes(task.id) ? "gray.3" : undefined}
                  onClick={onClick}
                >
                  <>
                    <Table.Td>
                      <Checkbox
                        aria-label="Select row"
                        checked={selectedRows.includes(task.id)}
                        onChange={onClick}
                        color="dark.3"
                      />
                    </Table.Td>
                    {tasksKeys.map((key, i) => (
                      <Table.Td key={i}>
                        {(task[key as TaskKey] ?? "").replace("_", " ")}
                      </Table.Td>
                    ))}
                  </>
                </Table.Tr>
              )
            })
          : null}
      </Table.Tbody>
    </Table>
  )
}
export default OverviewTable
