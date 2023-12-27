import { FC } from "react"
import { Table } from "@mantine/core"

type OverviewProps = {
  query?: { title?: string; date?: string; weight?: string; area?: string }
}

const Overview: FC<OverviewProps> = ({ query }) => {
  const queryKeys = Object.keys(query ?? {}) as (keyof NonNullable<
    typeof query
  >)[]

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          {queryKeys.map((key, i) => (
            <Table.Th key={i} style={{ textTransform: "capitalize" }}>
              {key}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {query ? (
          <Table.Tr>
            {queryKeys.map((key, i) => (
              <Table.Td key={i}>
                {(query[key] ?? "").replace("_", " ")}
              </Table.Td>
            ))}
          </Table.Tr>
        ) : null}
      </Table.Tbody>
    </Table>
  )
}

export default Overview
