import { FC, memo, useEffect, useState } from "react"
import { Task as TTask } from "@/types/Task"
import dayjs from "dayjs"
import { styled } from "styled-components"
import {
  ActionIcon,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Checkbox,
} from "@mantine/core"

import { IconPlus } from "@tabler/icons-react"
import { get, isEqual } from "lodash"
import ScheduleField from "./ScheduleField"
import DeleteIcon from "@/ui/icons/Delete"
import TextField from "./TextField"
import { useTasks } from "@/hooks/useTasks"
import CreateIcon from "@/ui/icons/Create"

const Section = styled(Card.Section).attrs({ px: "md", pb: "md" })`
  border-bottom: 1px solid ${({ theme }) => get(theme, "colors.gray[3]")};
`

const Label = styled(Text).attrs({ size: "sm", mt: "md" })`
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`

const Task: FC<{
  task: TTask
}> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks()
  const [edittedTask, editTask] = useState(task)

  useEffect(() => {
    // for some reason the edittedTask state doesnt get updated correctly
    if (edittedTask.id !== task.id) editTask(task)
  }, [edittedTask.id, task, task.id])

  const allowSubmit = !isEqual(task, edittedTask)

  return (
    <Card bg="gray.1" p="xl">
      <Section>
        <TextField
          value={edittedTask.title}
          onChange={(title) => editTask((prev) => ({ ...prev, title }))}
        />
        <Group justify="space-between">
          <ScheduleField
            scheduled={
              dayjs(edittedTask.schedule).isValid()
                ? dayjs(edittedTask.schedule).toDate()
                : undefined
            }
            onChange={(schedule) =>
              editTask((prev) => ({
                ...prev,
                schedule: schedule ? schedule.toISOString() : null,
              }))
            }
          />
          <Checkbox
            label="Completed"
            checked={edittedTask.completed}
            onChange={({ target }) =>
              editTask((prev) => ({ ...prev, completed: target.checked }))
            }
            style={{ display: "flex", justifyContent: "flex-end" }}
          />
        </Group>
        <Label c="dimmed">Description</Label>
        <TextField
          value={edittedTask.description}
          onChange={(description) =>
            editTask((prev) => ({ ...prev, description }))
          }
        />
      </Section>
      <Section mt="sm">
        <Label c="dimmed">
          Tags
          <CreateIcon
            size="sm"
            onClick={() =>
              editTask((prev) => ({ ...prev, tags: [...prev.tags, ""] }))
            }
          />
        </Label>
        <Group gap={7} mt={5}>
          {edittedTask.tags.map((tag, i) => (
            <TextField
              key={i}
              value={tag}
              onChange={(value) => {
                editTask((prev) => {
                  const tags = [...prev.tags]
                  tags[i] = value
                  return { ...prev, tags }
                })
              }}
              onDelete={() => {
                editTask((prev) => {
                  const tags = prev.tags.filter((t) => t !== tag)
                  return { ...prev, tags }
                })
              }}
            />
          ))}
        </Group>
      </Section>
      <Group mt="xl">
        <Button
          radius="md"
          style={{ flex: 1, border: allowSubmit ? "none" : "solid 1px" }}
          disabled={!allowSubmit}
          onClick={() => updateTask(edittedTask)}
        >
          Save Changes
        </Button>
        <DeleteIcon
          verifyBeforeDelete
          onClick={() => deleteTask(task.id)}
          size="sm"
        />
      </Group>
    </Card>
  )
}

export default memo(Task)
