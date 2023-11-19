export const jokesConfig = [
  {
    title: "Dad",
    fetcher: async () => {
      const url = "https://icanhazdadjoke.com/"
      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "text/plain" },
      })

      return await res.text()
    },
  },
  {
    title: "Dev",
    fetcher: async () => {
      const url = "https://backend-omega-seven.vercel.app/api/getjoke"
      const res = await fetch(url, { method: "GET" })
      const [data]: { punchline: string; question: string }[] = await res.json()

      return `Q: ${data.question}\n${data.punchline}`
    },
  },
  {
    title: "Chuck Norris",
    fetcher: async () => {
      const url = "https://api.chucknorris.io/jokes/random"
      const res = await fetch(url, { method: "GET" })
      const data = await res.json()
      return data.value
    },
  },
  {
    title: "Dark",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Dark?format=txt"
      const res = await fetch(url, { method: "GET" })
      const data = await res.text()
      return data
    },
  },
  {
    title: "Pun",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Pun?format=txt"
      const res = await fetch(url, { method: "GET" })
      const data = await res.text()
      return data
    },
  },
  {
    title: "Spooky",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Spooky?format=txt"
      const res = await fetch(url, { method: "GET" })
      const data = await res.text()
      return data
    },
  },
  {
    title: "Christmas",
    fetcher: async () => {
      const url = "https://v2.jokeapi.dev/joke/Christmas?format=txt"
      const res = await fetch(url, { method: "GET" })
      const data = await res.text()
      return data
    },
  },
]
