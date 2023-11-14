import { ChevronDownIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";

const jokesConfig = [
  {
    title: "Dad",
    fetcher: async () => {
      const url = "https://icanhazdadjoke.com/";
      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "text/plain" },
      });

      return await res.text();
    },
  },
  {
    title: "Dev",
    fetcher: async () => {
      const url = "https://backend-omega-seven.vercel.app/api/getjoke";
      const res = await fetch(url, { method: "GET" });
      const [data]: { punchline: string; question: string }[] =
        await res.json();

      return `Q: ${data.question}\n${data.punchline}`;
    },
  },
  {
    title: "Chuck Norris",
    fetcher: async () => {
      const url = "https://api.chucknorris.io/jokes/random";
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();
      return data.value;
    },
  },
  {
    title: "Dark",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Dark?format=txt";
      const res = await fetch(url, { method: "GET" });
      const data = await res.text();
      return data;
    },
  },
  {
    title: "Pun",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Pun?format=txt";
      const res = await fetch(url, { method: "GET" });
      const data = await res.text();
      return data;
    },
  },
  {
    title: "Spooky",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Spooky?format=txt";
      const res = await fetch(url, { method: "GET" });
      const data = await res.text();
      return data;
    },
  },
  {
    title: "Christmas",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Christmas?format=txt";
      const res = await fetch(url, { method: "GET" });
      const data = await res.text();
      return data;
    },
  },
];
const Jokes: FC = () => {
  const [mode, setMode] = useState(0);
  const [joke, setJoke] = useState("");

  const fetchJoke = useCallback(async (index: number) => {
    const joke = await jokesConfig[index].fetcher();
    setJoke(joke);
  }, []);

  useEffect(() => {
    fetchJoke(mode);
  }, [fetchJoke, mode]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      h="100%"
    >
      <>
        <Menu>
          <Tooltip label={jokesConfig[mode].title}>
            <MenuButton as={IconButton} px={1} size="sm">
              <ChevronDownIcon w={5} />
            </MenuButton>
          </Tooltip>
          <MenuList>
            {jokesConfig.map(({ title }, i) => (
              <MenuItem
                key={i}
                disabled={mode === i}
                backgroundColor={mode === i ? "goldenrod" : undefined}
                color={mode === i ? "#2055DA" : undefined}
                fontWeight={mode === i ? "bold" : undefined}
                onClick={() => setMode(i)}
              >
                {title}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Text
          whiteSpace="break-spaces"
          w="100%"
          px="2"
          lineHeight={1.1}
          minW={250}
          maxH={10}
          overflowY="auto"
        >
          {joke}
        </Text>
      </>
      <Tooltip label="Refresh">
        <IconButton
          size="sm"
          icon={<RepeatIcon />}
          aria-label="refresh"
          justifySelf="end"
          onClick={() => fetchJoke(mode)}
        />
      </Tooltip>
    </Box>
  );
};

export default Jokes;
