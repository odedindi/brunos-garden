import { FC, SVGAttributes } from "react"

const CustomizedAxisTick: FC<{
  x?: SVGAttributes<SVGTextElement>["x"]
  y?: SVGAttributes<SVGTextElement>["y"]
  stroke?: SVGAttributes<SVGTextElement>["fill"]
  payload?: Required<{ value: string }>
}> = ({ x, y, stroke, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="start"
        fill="#666"
        transform="rotate(45)"
      >
        {payload?.value}
      </text>
    </g>
  )
}

export default CustomizedAxisTick
