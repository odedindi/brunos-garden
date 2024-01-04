import { colorsNames } from "../colorNames"
export function* generateColor(): Generator<(typeof colorsNames)[number]> {
  for (let i = 0; i < colorsNames.length - 1; i++) yield colorsNames[i]
}
