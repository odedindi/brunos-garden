import { Title } from "@mantine/core"
import styled from "styled-components"

export const Slogen = styled.p.attrs({
  children: (
    <Title size="xs" style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {"Bruno's Garden"} <sub> CropTracker Pro</sub>
    </Title>
  ),
})<{ $hideFromSm?: boolean; $hideUpToSm?: boolean }>`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints!.sm!}) {
    display: ${({ $hideUpToSm }) => ($hideUpToSm ? "none" : "inherit")};
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints!.sm!}) {
    display: ${({ $hideFromSm }) => ($hideFromSm ? "none" : "inherit")};
  }
`
export default Slogen
