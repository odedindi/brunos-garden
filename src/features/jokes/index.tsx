import { Box, Menu, Stack, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { styled, useTheme } from "styled-components"
import { get } from "lodash"
import { jokesConfig } from "./config"
import ChevronIcon from "@/ui/icons/Chevron"
import RefreshIcon from "@/ui/icons/Refresh"
import useLocalStorage from "@/hooks/useLocalStorage"

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
  const [storage, setState] = useLocalStorage("jokes", { mode: 0, joke: "" })
  const [loading, setLoading] = useState(false)

  const mode = storage?.mode
  const joke = storage?.joke

  const setMode = (mode: number) => {
    setState((prev) => ({ ...prev, mode }))
    fetchJoke(mode)
  }

  const fetchJoke = useCallback(
    async (index: number) => {
      if (loading) return
      setLoading(true)
      const joke = await jokesConfig[index]?.fetcher()
      setState((prev) => ({ ...prev, joke }))
      setLoading(false)
    },
    [loading, setState],
  )

  useEffect(() => {
    if (!joke && !loading) fetchJoke(mode)
  }, [joke, fetchJoke, mode, loading])

  const theme = useTheme()
  return (
    <Base>
      <Menu>
        <Stack gap={0}>
          <Menu.Target>
            <div>
              <ChevronIcon size="sm" down label={jokesConfig[mode]?.title} />
            </div>
          </Menu.Target>
          <RefreshIcon
            size="sm"
            onClick={() => {
              if (!loading) fetchJoke(mode)
            }}
          />
        </Stack>

        <Menu.Dropdown>
          {jokesConfig.map(({ title }, i) => (
            <Menu.Item
              key={i}
              disabled={mode === i}
              style={{
                backgroundColor:
                  mode === i ? get(theme, "colors.gray[1]") : "inherit",
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
    </Base>
  )
}

export default Jokes
