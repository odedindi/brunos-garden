import styled from "styled-components"

export const Slogen = styled.p.attrs({
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
