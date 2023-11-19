import EditIcon from "@/ui/icons/Edit"
import { Input } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { FC } from "react"

const TextField: FC<{
  value: string
  onChange?: (nextValue: string) => void
}> = ({ value, onChange }) => {
  const [edit, { toggle }] = useDisclosure(false)
  return (
    <Input
      variant="filled"
      value={value}
      onChange={({ target }) => {
        if (onChange) onChange(target.value)
      }}
      disabled={!edit}
      rightSection={<EditIcon onClick={toggle} />}
      styles={{
        input: { padding: 0, cursor: "auto" },
        section: { width: "min-content" },
      }}
      rightSectionPointerEvents="all"
    />
  )
}

export default TextField
