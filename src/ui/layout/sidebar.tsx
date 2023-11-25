import { FC, useState } from "react"
import { AppShell, Card, Flex, ScrollArea, TextInput } from "@mantine/core"

import styled from "styled-components"
import { get } from "lodash"

import CreateIcon from "../icons/Create"
import { Slogen } from "./slogen"
import ChevronIcon from "../icons/Chevron"
import { useTasks } from "@/hooks/useTasks"
import { Task } from "@/types/Task"
import { useRouter } from "next/router"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { ParsedUrlQuery } from "querystring"
import dayjs from "dayjs"
import TasksList from "@/features/taskList"

const Navbar = styled(AppShell.Navbar)`
  background-color: ${({ theme }) => get(theme, "colors.pink[3]")};
`

const Sidebar: FC = () => {
  const { tasks, createTask } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchClick = () => {
    console.log(`Searching for "${searchQuery}"...`)
  }

  return (
    <Navbar py="md" px="xs" bg={"pink.3"}>
      <Slogen $hideFromSm />

      <Flex gap="sm" align="center" w="100%">
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          rightSection={
            <ChevronIcon size="sm" onClick={handleSearchClick} label="Search" />
          }
          style={{ flex: 1 }}
        />
        <CreateIcon size="md" onClick={createTask} />
      </Flex>
      <TasksList tasks={tasks} />
    </Navbar>
  )
}

export default Sidebar
