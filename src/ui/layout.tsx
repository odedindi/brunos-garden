import { FC, PropsWithChildren } from "react"
import Jokes from "@/features/jokes"
import { AppShell, Avatar, Box, Burger, Group, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import styled from "styled-components"
import { get } from "lodash"
import StrawberryLogo from "./StrawberryLogo"
import UserAvatar from "./Avatar"

const Header = styled(AppShell.Header)`
  display: flex;
  align-items: center;
  padding: 0 8px;
  background-color: ${({ theme }) => get(theme, "colors.orange[3]")};
`
const Navbar = styled(AppShell.Navbar)`
  background-color: ${({ theme }) => get(theme, "colors.pink[3]")};
`
const Main = styled(AppShell.Main)`
  background-color: ${({ theme }) => get(theme, "colors.green[3]")};
`
const Footer = styled(AppShell.Footer)`
  background-color: ${({ theme }) => get(theme, "colors.blue[3]")};
  overflow: auto;
`
const BrunosGarden = styled.p.attrs({
  children: (
    <>
      {"Bruno's Garden"} <sub>BETA</sub>
    </>
  ),
})<{ $hideFromSm?: boolean; $hideUpToSm?: boolean }>`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints!.sm!}) {
    display: ${({ $hideUpToSm }) => ($hideUpToSm ? "none" : "inherit")};
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints!.sm!}) {
    display: ${({ $hideFromSm }) => ($hideFromSm ? "none" : "inherit")};
  }
`
const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [navbarOpen, setNavbarOpen] = useLocalStorage({
    key: "navbar",
    defaultValue: true,
  })

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpen },
      }}
      footer={{ height: 75 }}
      padding="md"
    >
      <Header>
        <Group w="100%" wrap="nowrap" pr="xs">
          <Box w="100%" style={{ display: "flex", alignItems: "center" }}>
            <Burger
              opened={navbarOpen}
              onClick={() => setNavbarOpen((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <UserAvatar />
            <BrunosGarden $hideUpToSm />
          </Box>
          <StrawberryLogo href="/" />
        </Group>
      </Header>

      <Navbar p="md" bg={"pink.3"}>
        <BrunosGarden $hideFromSm />
      </Navbar>

      <Main bg={"green.3"}>{children}</Main>
      <Footer p="md" bg={"blue.3"}>
        <Jokes />
      </Footer>
    </AppShell>
  )
}
export default Layout
