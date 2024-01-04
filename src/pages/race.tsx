import { NextPage } from "next"
import dynamic from "next/dynamic"
import Jokes from "@/features/jokes"
import { useHarvests } from "@/hooks/useHarvests"
import { useRef, useEffect, useState, FC } from "react"
import { Box, Flex, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { Harvest } from "@/types/Harvest"
import * as d3 from "d3"
import { generateColor } from "@/features/overviewChart/utils/colorGenerator"
import BarChartRace from "@/features/overviewChart/raceChart"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})
const OverviewChart = dynamic(() => import("@/features/overviewChart"), {
  ssr: false,
})

const DemoPage: NextPage = () => {
  const { harvests } = useHarvests()

  return (
    <Layout headerProps={{ logoHref: "/" }} footer={<Jokes />}>
      {/* {harvests ? <OverviewChart harvests={harvests} /> : null} */}
      <Title order={1} style={{ textAlign: "center" }}>
        Demo Overview
      </Title>
      <Flex direction="column" w="100%" gap={"md"} px="xl">
        <Title order={4}>
          This chart animates the value (in $M) of the top global brands from
          2000 to 2019. Color indicates sector. See the explainer for more.
          Data: Interbrand
        </Title>
        <Box style={{ margin: "auto" }}>
          <BarChartRace />
        </Box>
      </Flex>
      <OverviewTable harvests={harvests} searchable />
    </Layout>
  )
}
export default DemoPage

// type BarplotProps = {
//   config?: {
//     width: number
//     height: number
//   }
//   // data: { name: string; y: number }[]
// }

// const margin = { top: 10, right: 30, bottom: 90, left: 40 }
// const Barplot: FC<BarplotProps> = ({
//   config = { width: 460, height: 450 },
//   // data,
// }) => {
//   const ref = useRef<SVGSVGElement>(null!)
//   const width = config.width - margin.left - margin.right
//   const height = config.height - margin.top - margin.bottom
//   const n = 12

//   useEffect(() => {
//     const colorGenerator = generateColor()
//     // append the svg object to the body of the page

//     const svg = d3
//       .select(ref.current)
//       .join("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`)
//     const asynFunc = async () => {
//       const data =
//         (await d3.json<
//           {
//             name: string
//             value: number
//             date: string
//             rank?: number
//           }[]
//         >("/data.json")) ?? []

//       const aggData = Object.entries(
//         data.reduce<{ [name: string]: number }>(
//           (acc, { name, value, date }) => {
//             if (!acc[name]) acc[name] = 0
//             acc[name] += value / 10000
//             return acc
//           },
//           {},
//         ),
//       )
//         .slice(0, 20)
//         .map(([name, value]) => ({ name, value }))

//       const groupData = d3.group(data, (d) => d.name)
//       const names = new Set(data.map((d) => d.name))
//       const datevalues = Array.from(
//         d3.rollup(
//           data,
//           ([d]) => d.value,
//           (d) => +new Date(d.date),
//           (d) => d.name,
//         ),
//       )
//         .map(([date, data]) => [new Date(date), data])
//         .sort(([a], [b]) => d3.ascending(a as Date, b as Date))

//       function rank(value: any) {
//         const data = Array.from(names, (name) => ({ name, value: value(name) }))
//         data.sort((a, b) => d3.descending(a.value, b.value))
//         for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i)
//         return data
//       }
//       console.log({ data, groupData, names, datevalues })
//       const x = d3
//         .scaleBand()
//         .range([0, width])
//         .domain(Array.from(new Set(aggData.map(({ name }) => name))))
//         .padding(0.2)
//       svg
//         .append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-45)")
//         .style("text-anchor", "end")

//       // Add Y axis
//       const y = d3
//         .scaleLinear()
//         .domain([
//           0,
//           aggData.reduce<number>(
//             (acc, { value }) => (value > acc ? value : acc),
//             0,
//           ),
//         ])
//         .range([height, 0])
//       svg.append("g").call(d3.axisLeft(y))

//       // Bars
//       aggData.forEach((data) => {
//         svg
//           .selectAll("mybar")
//           .data([data])
//           .enter()
//           .append("rect")
//           .attr("x", (d: any) => {
//             return x(d.name) ?? null
//           })
//           .attr("width", x.bandwidth())
//           .attr("fill", colorGenerator.next().value)
//           // no bar at the beginning thus:
//           .attr("height", function (d) {
//             return height - y(0)
//           }) // always equal to 0
//           .attr("y", function (d) {
//             return y(0)
//           })
//       })

//       // Animation
//       svg
//         .selectAll("rect")
//         .transition()
//         .duration(800)
//         .attr("y", function (d: any) {
//           return y(d.value)
//         })
//         .attr("height", (d: any) => {
//           return height - y(d.value)
//         })
//         .delay((_d, i) => i * 100)
//     }
//     asynFunc()
//   }, [height, width])

//   // Parse the Data

//   // compute all the <rect>

//   return (
//     <div id="my_dataviz">
//       <svg ref={ref} width={width} height={height}>
//         {/* // render all the <rect> */}
//       </svg>
//     </div>
//   )
// }
