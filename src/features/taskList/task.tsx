import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Box,
  Flex,
  Checkbox,
  Tag,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FC } from "react";
import { DragHandleIcon } from "@chakra-ui/icons";
import { Task as TTask } from "@/types/Task";
import dayjs from "dayjs";
import TextField from "./TextField";
import DateField from "./DatePicker";

const Task: FC<{
  task: TTask;
  handle: {
    create: (task: TTask) => void;
    update: (task: TTask) => void;
    delete: (taskId: string) => void;
  };
}> = ({ task, handle }) => {
  console.log({ task: task.completed });

  return (
    <Card my="2">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Box w="100%">
              <Box display="flex" flexFlow="row wrap" gap={2}>
                <Checkbox
                  defaultChecked={task.completed}
                  onChange={({ currentTarget: { checked: completed } }) =>
                    handle.update({ ...task, completed })
                  }
                >
                  {task.completed
                    ? "Completed"
                    : task.schedule
                    ? "Pending"
                    : "Unscheduled"}
                </Checkbox>
                <DateField
                  date={task.schedule}
                  onChange={(date) =>
                    handle.update({ ...task, schedule: dayjs(date).toDate() })
                  }
                />
              </Box>
              <TextField
                value={task.title}
                onChange={(title) => {
                  console.log({ title });

                  handle.update({ ...task, title });
                }}
              />
            </Box>
          </Flex>
          <Menu>
            <MenuButton as={Button}>
              <DragHandleIcon viewBox="0 0 2 10" pr="6px" />
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() =>
                  handle.create({
                    ...task,
                    id: Math.random().toString().slice(0, 24),
                  })
                }
              >
                Create a Copy
              </MenuItem>
              <MenuItem color="red" onClick={() => handle.delete(task.id)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {task.tags.map((tag, i) => (
            <Tag key={i} size="lg" variant="solid" colorScheme="teal">
              {tag}
            </Tag>
          ))}
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Summary
            </Heading>
            <TextField
              value={task.description}
              onChange={(description) =>
                handle.update({ ...task, description })
              }
            />
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Attributes
            </Heading>
            {task.attributes.map(({ description, id }) => (
              <Box key={id}>
                <Text pt="2" fontSize="sm">
                  {description}
                </Text>
              </Box>
            ))}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Task;
