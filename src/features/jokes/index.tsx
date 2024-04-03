import { Box, Menu, Stack, Text } from "@mantine/core"
import { FC, useCallback, useEffect, useState } from "react"
import { jokesConfig } from "./config"
import ChevronIcon from "@/ui/icons/Chevron"
import RefreshIcon from "@/ui/icons/Refresh"
import useLocalStorage from "@/hooks/useLocalStorage"
import classes from "./jokes.module.css"

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

  return (
    <Box className={classes.base}>
      <Menu>
        <Stack gap={0}>
          <Menu.Target>
            <div>
              <ChevronIcon size="sm" down label={jokesConfig[mode]?.title} />
            </div>
          </Menu.Target>
          <RefreshIcon size="sm" onClick={() => fetchJoke(mode)} />
        </Stack>

        <Menu.Dropdown>
          {jokesConfig.map(({ title }, i) => (
            <Menu.Item
              key={i}
              className={mode === i ? classes.selectedMode : ""}
              onClick={() => setMode(i)}
            >
              {title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <Text size={"md"} px={"sm"} className={classes.joke}>
        {joke}
      </Text>
    </Box>
  )
}

export default Jokes
