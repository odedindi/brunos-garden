import { FC, useState } from "react"
import { Task as TTask } from "@/types/Task"
import dayjs from "dayjs"
import { styled } from "styled-components"
import {
  Accordion,
  ActionIcon,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  Checkbox,
} from "@mantine/core"
import { Carousel } from "@mantine/carousel"

import { IconCamera, IconPlus } from "@tabler/icons-react"
import { get, isEqual } from "lodash"
import ScheduleField from "./ScheduleField"
import Delete from "@/ui/icons/Delete"
import TextField from "./TextField"

const image =
  "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

const Base = styled(Card)`
  background-color: ${({ theme }) => get(theme, "colors.gray[1]")};
  padding: 0;
`
const Section = styled(Card.Section).attrs({ px: "md", pb: "md" })`
  border-bottom: 1px solid ${({ theme }) => get(theme, "colors.gray[3]")};
`

const Label = styled(Text).attrs({ size: "sm", mt: "md" })`
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`

const Tag: FC<{ tag?: string }> = ({ tag }) => (
  <Badge variant="light">{tag}</Badge>
)

const Task: FC<{
  task: TTask
  handle: {
    create: (task: TTask) => void
    update: (task: TTask) => void
    delete: (taskId: string) => void
  }
}> = ({ task, handle }) => {
  console.log({ task: task.completed })
  const [edittedTask, editTask] = useState(() => task)

  return (
    <Base>
      <Accordion style={{ border: "none" }}>
        <Accordion.Item value={task.id} style={{ border: "none", padding: 0 }}>
          <Accordion.Control>
            <Text
              c={
                task.completed
                  ? "green"
                  : dayjs(edittedTask.schedule).isValid() &&
                      dayjs(edittedTask.schedule).isBefore(dayjs())
                    ? "dark"
                    : "red"
              }
            >
              {task.title}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Section mb="md">
              <TextField
                value={edittedTask.title}
                onChange={(title) => editTask((prev) => ({ ...prev, title }))}
              />
              <Group justify="apart" grow>
                <ScheduleField
                  scheduled={
                    dayjs(edittedTask.schedule).isValid()
                      ? dayjs(edittedTask.schedule).toDate()
                      : undefined
                  }
                  onChange={(schedule) =>
                    editTask((prev) => ({ ...prev, schedule }))
                  }
                />
                <Checkbox
                  label="completed"
                  checked={edittedTask.completed}
                  onChange={({ target }) => {
                    console.log({ target })
                    editTask((prev) => ({ ...prev, completed: target.checked }))
                  }}
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
            <Section>
              <Label c="dimmed">
                Tags
                <ActionIcon size="xs" bg="dark.3">
                  <IconPlus />
                </ActionIcon>
              </Label>
              <Group gap={7} mt={5}>
                {task.tags.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </Group>
            </Section>

            <Card.Section>
              <Accordion>
                <Accordion.Item value="images">
                  <Accordion.Control>
                    <IconCamera size="16px" />
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Carousel withIndicators loop>
                      {[image, image, image].map((src, i) => (
                        <Carousel.Slide key={i}>
                          <Image src={src} alt={task.title} height={180} />
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card.Section>

            <Group mt="xs">
              <Button
                radius="md"
                style={{ flex: 1 }}
                disabled={isEqual(task, edittedTask)}
                onClick={() => handle.update(edittedTask)}
              >
                Save Changes
              </Button>
              <Delete
                verifyBeforeDelete
                onClick={() => handle.delete(task.id)}
              />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Base>
  )
}

export default Task
