import { FC, PropsWithChildren } from "react"
import Jokes from "@/features/jokes"
import { AppShell, Burger, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import Link from "next/link"
import styled from "styled-components"
import { get } from "lodash"

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
        <Burger
          opened={navbarOpen}
          onClick={() => setNavbarOpen((o) => !o)}
          hiddenFrom="sm"
          size="sm"
        />
        <Text component={Link} href="/" style={{ textDecoration: "unset" }}>
          {"Bruno's Garden"} <sub>BETA</sub>
        </Text>
      </Header>

      <Navbar p="md" bg={"pink.3"}>
        Navbar
      </Navbar>

      <Main bg={"green.3"}>{children}</Main>
      <Footer p="md" bg={"blue.3"}>
        <Jokes />
      </Footer>
    </AppShell>
  )
}
export default Layout
