import DeleteIcon from "@/ui/icons/Delete"
import EditIcon from "@/ui/icons/Edit"
import { Flex, Input } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { CSSProperties, FC, useRef } from "react"

const TextField: FC<{
  value: string
  onChange?: (nextValue: string) => void
  onDelete?: () => void
}> = ({ value, onChange, onDelete }) => {
  const [edit, { close, toggle }] = useDisclosure(false)
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
        <Flex gap="2px" direction="column">
          <EditIcon
            onClick={() => {
              if (!edit) setTimeout(() => ref.current?.focus())
              toggle()
            }}
            size="sm"
            bg={edit ? "grape" : undefined}
          />
          {onDelete ? <DeleteIcon onClick={onDelete} size="sm" /> : null}
        </Flex>
      }
      styles={{
        input: {
          padding: "0 8px",
          cursor: "auto",
          border: edit ? "solid 1px purple" : undefined,
          color: "black",
        },
        section: {
          width: "min-content",
          padding: "0 4px",
        },
      }}
      rightSectionPointerEvents="all"
      onBlur={close}
      size="lg"
    />
  )
}

export default TextField
