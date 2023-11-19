import { IconChevronDown, IconRepeat } from "@tabler/icons-react"

import { Box, ActionIcon, Menu, Text, Tooltip } from "@mantine/core"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { styled, useTheme } from "styled-components"

import { useLocalStorage } from "@mantine/hooks"
import { get } from "lodash"
import { jokesConfig } from "./config"

const Base = styled(Box)`
  display: flex;
  align-items: start;
  height: 100%;
  width: 100%;
`

const Joke = styled(Text).attrs({ size: "sm", px: "sm", pb: "sm" })`
  white-space: break-spaces;
  line-height: 1;
  flex: 1;
`

const Jokes: FC = () => {
  const [storage, setState] = useLocalStorage({
    key: "jokes",
    defaultValue: { mode: 0, joke: "" },
  })
  const [loading, setLoading] = useState(false)
  const { mode, joke } = useMemo(
    () => ({ mode: storage?.mode, joke: storage?.joke }),
    [storage],
  )

  const setMode = (mode: number) => {
    setState((prev) => ({ ...prev, mode }))
    fetchJoke(mode)
  }

  const fetchJoke = useCallback(
    async (index: number) => {
      setLoading(true)
      const joke = await jokesConfig[index]?.fetcher()
      setState((prev) => ({ ...prev, joke }))
      setLoading(false)
    },
    [setState],
  )

  useEffect(() => {
    if (!joke) fetchJoke(mode)
  }, [joke, fetchJoke, mode])

  const theme = useTheme()
  return (
    <Base>
      <Menu>
        <Tooltip label={jokesConfig[mode]?.title}>
          <Menu.Target>
            <ActionIcon size="sm">
              <IconChevronDown />
            </ActionIcon>
          </Menu.Target>
        </Tooltip>
        <Menu.Dropdown>
          {jokesConfig.map(({ title }, i) => (
            <Menu.Item
              key={i}
              disabled={mode === i}
              style={{
                backgroundColor:
                  mode === i ? get(theme, "colors.blue[2]") : "inherit",
                fontWeight: mode === i ? 900 : "inherit",
              }}
              onClick={() => setMode(i)}
            >
              {title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <Joke>{joke}</Joke>
      <Tooltip label="Refresh">
        <ActionIcon
          size="sm"
          aria-label="refresh"
          onClick={() => {
            if (!loading) fetchJoke(mode)
          }}
        >
          <IconRepeat />
        </ActionIcon>
      </Tooltip>
    </Base>
  )
}

export default Jokes
