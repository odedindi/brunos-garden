import React, { FC, useEffect, useRef } from "react"
import {
  select,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending,
} from "d3"
import useResizeObserver from "./hooks/useResizeObserver"
import styled from "styled-components"

const MARGIN = { TOP: 10, RIGHT: 50, BOTTOM: 100, LEFT: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const Svg = styled.svg``
const StackedBarChart: FC<{
  data: ({ month: string } & { [crop: string]: number })[]
  keys: string[]
  colors: { [color: string]: string }
}> = ({ data, keys, colors }) => {
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const svgRef = useRef<SVGSVGElement>(null!)
  const dimensions = useResizeObserver(wrapperRef)

  // will be called initially and on every data change
  useEffect(() => {
    // if (!svgRef.current) return
    const svg = select(svgRef.current)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect()

    // stacks / layers
    const stackGenerator = stack().keys(keys).order(stackOrderAscending)
    const layers = stackGenerator(data)
    const extent = [
      0,
      max(layers, (layer) => max(layer, (sequence) => sequence[1])),
    ].filter((n) => n !== undefined) as number[]

    // scales
    const xScale = scaleBand()
      .domain(data.map((d) => `${d.month}`))
      .range([0, width])
      .padding(0.25)

    const yScale = scaleLinear().domain(extent).range([height, 0])

    // labels
    const xLabel = svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 50)
      .attr("text-anchor", "middle")

    const yLabel = svg
      .append("text")
      .attr("x", -HEIGHT / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Number of Viewers")

    // rendering
    svg
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (layer) => colors[layer.key])
      .selectAll("rect")
      .data((layer) => layer)
      .join("rect")
      .attr("x", (sequence) => xScale(`${sequence.data.month}`) ?? null)
      .attr("width", xScale.bandwidth())
      .attr("y", (sequence) => yScale(sequence[1]))
      .attr("height", (sequence) => yScale(sequence[0]) - yScale(sequence[1]))

    // axes
    const xAxis = axisBottom(xScale)
    svg
      .select<SVGGElement>(".x-axis") // Specify the type of the selection as SVGGElement
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)

    const yAxis = axisLeft(yScale) // Specify the type of the axis as number
    svg
      .select<SVGGElement>(".y-axis") // Specify the type of the selection as SVGGElement
      .call(yAxis)
  }, [colors, data, dimensions, keys])

  return (
    <>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </>
  )
}

export default StackedBarChart
