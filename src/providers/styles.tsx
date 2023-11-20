import { FC, PropsWithChildren } from "react"
import { MantineProvider } from "@mantine/core"
import { NavigationProgress } from "@mantine/nprogress"

import { theme } from "@/config/theme"
import { ThemeProvider } from "styled-components"

const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <MantineProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <NavigationProgress />
      {children}
    </ThemeProvider>
  </MantineProvider>
)

export default StylesProvider
