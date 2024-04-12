import { useMe } from "@/hooks/useMe"
import {
  Avatar,
  Button,
  Box,
  Menu,
  Loader as MantineLoader,
  UnstyledButton,
  Group,
  Text,
  rem,
  BoxProps,
} from "@mantine/core"
import { signIn, signOut } from "next-auth/react"
import { ComponentPropsWithoutRef, FC, useState } from "react"
import classes from "./authentication.module.css"
import cx from "clsx"

import { IconLogout, IconChevronDown } from "@tabler/icons-react"

const Loader: FC = () => (
  <Box mr={5}>
    <Button variant="default">
      <MantineLoader color="gray" size="sm" />
    </Button>
  </Box>
)
const Authentication: FC<BoxProps> = (props) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  const { me, isLoading } = useMe()

  if (isLoading) return <Loader />

  return (
    <Box {...props}>
      {me ? (
        me.image ? (
          <Menu
            shadow="sm"
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            openDelay={500}
            closeDelay={500}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7} wrap="nowrap">
                  <Avatar
                    src={me.image}
                    alt={me.name ?? ""}
                    radius="xl"
                    size={20}
                  />
                  <Text
                    fw={500}
                    size="sm"
                    lh={1}
                    mr={3}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {me.name}
                  </Text>
                  <IconChevronDown
                    stroke={1.5}
                    className={cx(classes.icon, {
                      [classes.iconActive]: userMenuOpened,
                    })}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => signOut()}
                leftSection={
                  <IconLogout
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            variant="default"
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={() => signOut()}
          >
            Logout
          </Button>
        )
      ) : (
        <Button
          leftSection={<GoogleIcon />}
          variant="default"
          onClick={() => signIn("google")}
          mx="sm"
          style={{ cursor: "pointer" }}
        >
          Sign In
        </Button>
      )}
    </Box>
  )
}

export default Authentication

const GoogleIcon: FC<ComponentPropsWithoutRef<"svg">> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 262"
    style={{ width: "0.9rem", height: "0.9rem" }}
    {...props}
  >
    <path
      fill="#4285F4"
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
    />
    <path
      fill="#34A853"
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
    />
    <path
      fill="#FBBC05"
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
    />
    <path
      fill="#EB4335"
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
    />
  </svg>
)
