import { useState, useEffect } from "react"

// use this hook to replace useLocalStorage from @mantine/hooks that leads to rerenndering loop

const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    let currentValue

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || JSON.stringify(defaultValue),
      )
    } catch (error) {
      currentValue = defaultValue
    }

    return currentValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as const
}

export default useLocalStorage
