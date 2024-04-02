import type { FC } from "react"
import { Avatar, Box } from "@mantine/core"
import Link from "next/link"
import classes from "./StrawberryLogo.module.css"

const StrawberryLogo: FC<{ href?: string }> = ({ href }) => {
  const strawberry = (
    <>
      <Avatar src="/strawberry.svg" className={classes.shadow} />
      <Avatar
        src="/icons/android-chrome-512x512.png"
        className={classes.strawberry}
      />
    </>
  )
  return (
    <Box className={classes.base}>
      {href ? <Link href={href}>{strawberry}</Link> : strawberry}
    </Box>
  )
}

export default StrawberryLogo
