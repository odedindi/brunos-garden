import { CSSProperties, FC, useState } from "react"
import { useForm } from "@mantine/form"
import { IconAt } from "@tabler/icons-react"
import {
  TextInput,
  Group,
  Checkbox,
  Paper,
  LoadingOverlay,
  Button,
} from "@mantine/core"
import { User } from "@/types/User"

type AuthenticationFormProps = {
  style?: CSSProperties
  initialValues: User
  onSubmit: (user: User) => void
}

export const AuthenticationForm: FC<AuthenticationFormProps> = ({
  initialValues,
  onSubmit,
  style,
}) => {
  const [loading, setLoading] = useState(false)

  const form = useForm({ initialValues })

  const handleSubmit = () => {
    setLoading(true)
    onSubmit(form.values)
  }

  return (
    <Paper
      p={"lg"}
      shadow={"sm"}
      style={{
        ...style,
        position: "relative",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={loading} />

        <Group grow>
          <TextInput
            data-autofocus
            required
            placeholder="Your name"
            label="Name"
            {...form.getInputProps("name")}
          />

          <TextInput
            required
            placeholder="email"
            label="email"
            {...form.getInputProps("email")}
            disabled
            leftSection={<IconAt size={16} stroke={1.5} />}
          />
        </Group>

        <TextInput
          mt="md"
          required
          placeholder={"image url"}
          label="Image"
          {...form.getInputProps("image")}
        />

        <Checkbox
          mt="xl"
          label="I agree to sell my soul and privacy to this corporation"
          required
          checked
          onChange={() => {}}
          style={{ cursor: "pointer" }}
        />
        <Button mt="md" type="submit">
          Submit
        </Button>
      </form>
    </Paper>
  )
}
