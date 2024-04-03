import { FC, PropsWithChildren } from "react"
import { MantineProvider } from "@mantine/core"
import { NavigationProgress } from "@mantine/nprogress"

import { theme } from "@/config/theme"

const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <MantineProvider theme={theme}>
    <NavigationProgress />
    {children}
  </MantineProvider>
)

export default StylesProvider
