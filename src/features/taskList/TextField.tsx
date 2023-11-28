import EditIcon from "@/ui/icons/Edit"
import { Input } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { FC, useRef } from "react"

const TextField: FC<{
  value: string
  onChange?: (nextValue: string) => void
}> = ({ value, onChange }) => {
  const [edit, { toggle }] = useDisclosure(false)
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Input
      ref={ref}
      variant="filled"
      value={value}
      onChange={({ target }) => {
        if (onChange) onChange(target.value)
      }}
      disabled={!edit}
      rightSection={
        <EditIcon
          onClick={() => {
            if (!edit) setTimeout(() => ref.current?.focus())
            toggle()
          }}
          size="md"
          bg={edit ? "grape" : undefined}
        />
      }
      styles={{
        input: {
          padding: "0 8px",
          cursor: "auto",
          border: edit ? "solid 1px purple" : undefined,
        },
        section: {
          width: "min-content",
          padding: "0 4px",
        },
      }}
      rightSectionPointerEvents="all"
    />
  )
}

export default TextField
