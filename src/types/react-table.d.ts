import { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  export interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}
