import { FC, SVGAttributes } from "react"

const CustomizedLabel: FC<{
  x?: SVGAttributes<SVGTextElement>["x"]
  y?: SVGAttributes<SVGTextElement>["y"]
  stroke?: SVGAttributes<SVGTextElement>["fill"]
  value?: SVGAttributes<SVGTextElement>["children"]
}> = ({ x, y, stroke, value }) => (
  <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
    {value}
  </text>
)

export default CustomizedLabel
