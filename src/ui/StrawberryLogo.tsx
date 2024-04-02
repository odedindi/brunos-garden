import type { FC } from "react"
import { Avatar, Box } from "@mantine/core"
import classes from "./StrawberryLogo.module.css"

const StrawberryLogo: FC = () => (
  <Box className={classes.base}>
    <Avatar src="/strawberry.svg" className={classes.shadow} />
    <Avatar
      src="/icons/android-chrome-512x512.png"
      className={classes.strawberry}
    />
  </Box>
)

export default StrawberryLogo
