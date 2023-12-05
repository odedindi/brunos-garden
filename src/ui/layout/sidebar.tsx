import { FC, ReactNode, forwardRef, useMemo, useState } from "react"
import { AppShell, Flex, TextInput, Menu } from "@mantine/core"

import styled from "styled-components"
import { get } from "lodash"

import CreateIcon from "../icons/Create"
import { Slogen } from "./slogen"
import { useTasks } from "@/hooks/useTasks"
import { Task } from "@/types/Task"
import dayjs from "dayjs"
import TasksList from "@/features/taskList"

import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconCalendar,
  IconSquareRounded, // for not completed tasks
  IconSquareRoundedCheck, // for completed tasks
} from "@tabler/icons-react"
import SortIcon from "../icons/Sort"

const Navbar = styled(AppShell.Navbar)`
  background-color: ${({ theme }) => get(theme, "colors.pink[3]")};
`
type SortOption =
  | "ascLetters"
  | "descLetters"
  | "completed"
  | "notCompleted"
  | "endingSoon"
  | ""

const sortOptions: { option: SortOption; icon: ReactNode }[] = [
  { option: "ascLetters", icon: <IconSortAscendingLetters /> },
  { option: "descLetters", icon: <IconSortDescendingLetters /> },
  { option: "notCompleted", icon: <IconSquareRounded /> },
  { option: "completed", icon: <IconSquareRoundedCheck /> },
  { option: "endingSoon", icon: <IconCalendar /> },
]

const sortTasks = ({
  sortBy,
  tasks,
}: {
  sortBy: SortOption
  tasks: Task[]
}) => {
  switch (sortBy) {
    case "ascLetters":
      return tasks.sort(({ title: a }, { title: b }) =>
        a.localeCompare(b, undefined, {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      )
    case "descLetters":
      return tasks.sort(({ title: a }, { title: b }) =>
        b.localeCompare(a, undefined, {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      )
    case "notCompleted":
      return tasks.sort(({ completed: a }, { completed: b }) =>
        !a && !b ? 0 : !a ? 1 : -1,
      )
    case "completed":
      return tasks.sort(({ completed: a }, { completed: b }) =>
        a && b ? 0 : a ? 1 : -1,
      )
    case "endingSoon":
      return tasks.sort(({ schedule: a }, { schedule: b }) =>
        (a && !b) || (a && dayjs(a).isBefore(b))
          ? 1
          : (b && !a) || (b && dayjs(b).isBefore(a))
            ? -1
            : 0,
      )
    default:
      return tasks
  }
}

const Sidebar: FC = () => {
  const { tasks, createTask } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("endingSoon")

  const visibleTasks = useMemo(() => {
    if (searchQuery.length >= 2)
      return sortTasks({
        sortBy,
        tasks: tasks.filter((t) => {
          const searchQueryLowerCase = searchQuery.toLowerCase()
          return (
            t.title.toLowerCase().includes(searchQueryLowerCase) ||
            t.description.toLowerCase().includes(searchQueryLowerCase) ||
            t.category?.toLowerCase().includes(searchQueryLowerCase) ||
            t.tags.some((tag) =>
              tag.toLowerCase().includes(searchQueryLowerCase),
            )
          )
        }),
      })
    return sortTasks({ sortBy, tasks })
  }, [searchQuery, sortBy, tasks])
  return (
    <Navbar py="md" px="xs" bg={"pink.3"}>
      <Slogen $hideFromSm />
      <Flex direction="column" gap="xs" pr="xs">
        <Flex gap="sm" align="center" w="100%">
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            style={{ flex: 1 }}
          />
          <Menu
            shadow="xl"
            trigger="hover"
            position="right-start"
            withArrow
            arrowPosition="center"
            openDelay={250}
            closeDelay={400}
            closeOnItemClick={false}
          >
            <Menu.Target>
              <IconWRef />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort </Menu.Label>
              {sortOptions.map(({ option, icon }) => (
                <Menu.Item
                  key={option}
                  bg={sortBy === option ? "gray.2" : "inherit"}
                  onClick={() =>
                    setSortBy((prev) => (prev === option ? "" : option))
                  }
                >
                  {icon}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <CreateIcon size="md" onClick={createTask} />
        </Flex>
      </Flex>
      <TasksList tasks={visibleTasks} />
    </Navbar>
  )
}

export default Sidebar

const IconWRef = forwardRef<HTMLDivElement>((props, ref) => (
  <Flex ref={ref}>
    <SortIcon size="md" {...props} />
  </Flex>
))
