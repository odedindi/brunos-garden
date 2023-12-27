import { FC } from "react"

import { Avatar, Box } from "@mantine/core"

import Link from "next/link"
import styled from "styled-components"

const BerryCage = styled(Box)`
  position: relative;
  cursor: pointer;
`

const StrawberryShadow = styled(Avatar).attrs({
  src: "/strawberry.svg",
})`
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 8px;
  rotate: 35deg;
  opacity: 0.7;
`
const Strawberry = styled(Avatar).attrs({
  src: "/icons/android-chrome-512x512.png",
})`
  z-index: 2;
`

const StrawberryLogo: FC<{ href?: string }> = ({ href }) =>
  href ? (
    <BerryCage>
      <Link href={href}>
        <StrawberryShadow />
        <Strawberry />
      </Link>
    </BerryCage>
  ) : (
    <BerryCage>
      <StrawberryShadow />
      <Strawberry />
    </BerryCage>
  )

export default StrawberryLogo
