import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  csv,
  json,
  schemeTableau10,
  easeLinear,
  select,
  scaleOrdinal,
  axisTop,
  format,
  interpolateNumber,
  ascending,
  rollup,
  utcFormat,
  pairs,
  InternMap,
  scaleLinear,
  scaleBand,
  range,
  Transition,
  groups,
  descending,
} from "d3"
import { Selection } from "d3-selection"

type Datum = {
  name: string
  value: number
  rank?: number
  category: string
}
const duration = 250
const margin = {
  top: 16,
  right: 6,
  bottom: 6,
  left: 0,
}
const barSize = 48
const n = 12
const k = 10
const defaultWidth = 960
const defaultHeight = margin.top + barSize * n + margin.bottom
const names = ["data"]
const x = (width: number) =>
  scaleLinear([0, 1], [margin.left, width - margin.right])

const y = () =>
  scaleBand()
    .domain(`${range(n + 1)}`)
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)

const formatDate = utcFormat("%Y")

const axis = (svg: SVGSVGElement, width: number) => {
  const g = select(svg)
    .append("g")
    .attr("transform", `translate(0,${margin.top})`)

  const axis = axisTop(x(width))
    .ticks(defaultWidth / 160)
    .tickSizeOuter(0)
    .tickSizeInner(-barSize * (n + y().padding()))

  return (_: unknown, transition: string) => {
    g.transition(transition).call(axis)
    g.select(".tick:first-of-type text").remove()
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white")
    g.select(".domain").remove()
  }
}

const color = (data: Datum[]) => {
  const scale = scaleOrdinal(schemeTableau10)
  if (data.some((d) => d.category !== undefined)) {
    const categoryByName = new Map(data.map((d) => [d.name, d.category]))
    scale.domain(categoryByName.values())
    return (d: Datum) => scale(categoryByName.get(d.name)!)
  }
  return (d: Datum) => scale(d.name)
}

function useDataLoader<T>(url: string, type: "json", defaultValue: T): T {
  const [data, setData] = useState<T>(defaultValue)
  if (type === "json") {
    const fetchData = async () => {
      const data = await json<T>(url)
      if (data) setData(data)
    }
    fetchData()
  }

  return data
}

const BarChartRace: React.FC = () => {
  const data = useDataLoader<
    {
      name: string
      value: number
      date: string
      rank?: number
    }[]
  >("/data.json", "json", [])
  const ref = useRef<SVGSVGElement>(null!)
  const width = defaultWidth - margin.left - margin.right
  const height = defaultHeight - margin.top - margin.bottom
  const replay = () => {
    // Add replay logic here
  }

  //   const bars = (svg: SVGSVGElement, width: number) => {
  //     const bar = select(svg)
  //       .append("g")
  //       .attr("fill-opacity", 0.6)
  //       .selectAll("rect")

  //     return (
  //       [date, data]: [Date, Datum[]],
  //       transition: Transition<SVGSVGElement, Datum, null, undefined>,
  //     ) => {
  //       bar
  //         .data<Datum>(data.slice(0, n), (d) => (d as Datum).name)
  //         .join(
  //           (enter) =>
  //             enter
  //               .append("rect")
  //               .attr("fill", color(data))
  //               .attr("height", y().bandwidth())
  //               .attr("x", x(width)(0))
  //               .attr("y", `${(d:Datum) => y()((prev.get(d) ?? d).rank ?? "")}`)
  //               .attr(
  //                 "width",
  //                 (d) => x(width)((prev.get(d) || d).value) - x(width)(0),
  //               ),
  //           (update) => update,
  //           (exit) =>
  //             exit
  //               .transition(transition)
  //               .remove()
  //               .attr("y", (d) => y()((next.get(d) || d).rank) ?? "")
  //               .attr(
  //                 "width",
  //                 (d) => x(width)((next.get(d) || d).value) - x(0)(0),
  //               ),
  //         )
  //         .call((bar) =>
  //           bar
  //             .transition(transition)
  //             .attr("y", (d) => y()(`${d.rank}`) ?? "")
  //             .attr("width", (d) => x(width)(d.value) - x(width)(0)),
  //         )
  //     }
  //   }

  const chart = useCallback(
    (svgEl: SVGSVGElement) => {
      // Chart logic
      console.log(svgEl)

      const svg = select(svgEl)
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")

      //   const updateBars = bars(svg)
      const updateAxis = axis(svgEl, width)
      //   const updateLabels = labels(svg)
      //   const updateTicker = ticker(svg)
    },

    [height, width],
  )
  const datevalues = useMemo(
    () =>
      Array.from(
        rollup(
          data,
          ([d]) => d.value,
          (d) => +new Date(d.date).getTime(),
          (d) => d.name,
        ),
      )
        .map(([date, data]): [Date, InternMap<string, number>] => [
          new Date(date),
          data,
        ])

        .sort(([a], [b]) => ascending(a, b)),
    [data],
  )
  const rank = useCallback((value: (name: string) => number) => {
    const data = Array.from(names, (name): Datum & { rank?: number } => ({
      name,
      value: value(name),
    }))
      .sort((a, b) => descending(a.value, b.value))
      .map((d, i) => ({ ...d, rank: Math.min(n, i) }))

    return data
  }, [])
  const keyframes = useMemo(() => {
    const keyframes: [Date, Datum][] = []
    let ka: Date | undefined
    let a: InternMap<string, Datum> | undefined
    let kb: Date | undefined
    let b: InternMap<string, Datum> | undefined
    for ([[ka, a], [kb, b]] of pairs(datevalues)) {
      for (let i = 0; i < k; ++i) {
        const t = i / k
        keyframes.push([
          new Date(ka.getTime() * (1 - t) + kb.getTime() * t),
          rank(
            (name: string) =>
              (a?.get(name) ?? 0) * (1 - t) + (b?.get(name) ?? 0) * t,
          ),
        ] as [Date, Datum])
      }
    }
    if (kb)
      keyframes.push([
        new Date(kb),
        rank((name: string) => b?.get(name) ?? 0),
      ] as [Date, Datum])
    return keyframes
  }, [datevalues, rank])

  const _prev = (nameframes: [Date, Datum][][]) =>
    new Map(keyframes.flatMap(([_, data]) => pairs(data, (a, b) => [b, a])))

  const _next = (nameframes: [Date, Datum][][]) =>
    new Map(nameframes.flatMap(([, data]) => pairs(data)))

  const _nameframes = useMemo(() => {
    return groups(
      keyframes.flatMap(([, data]) => data),
      (d) => d.name,
    )
  }, [keyframes])
  const ticker = useCallback(
    (svgEl: Selection<SVGSVGElement, Datum, null, undefined>) => {
      const now = svgEl
        .append("text")
        .attr("style", `font: bold ${barSize}px var(--sans-serif)`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", margin.top + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]))

      return (
        [date]: [Date],
        transition: Transition<SVGSVGElement, Datum, null, undefined>,
      ) => {
        transition.end().then(() => now.text(formatDate(date)))
      }
    },
    [keyframes, width],
  )
  useEffect(() => {
    if (ref.current) chart(ref.current)
  }, [chart])

  return (
    <div>
      <button onClick={replay}>Replay</button>
      <svg ref={ref} width={width} height={height} />
    </div>
  )
}
export default BarChartRace

// function _data(FileAttachment) {
//   return FileAttachment("category-brands.csv").csv({ typed: true })
// }

// function _replay(html) {
//   return html`<button>Replay</button>`
// }

// async function* _chart(
//   replay,
//   d3,
//   width,
//   height,
//   bars,
//   axis,
//   labels,
//   ticker,
//   keyframes,
//   duration,
//   x,
//   invalidation,
// ) {
//   replay

//   const svg = d3
//     .create("svg")
//     .attr("viewBox", [0, 0, width, height])
//     .attr("width", width)
//     .attr("height", height)
//     .attr("style", "max-width: 100%; height: auto;")

//   const updateBars = bars(svg)
//   const updateAxis = axis(svg)
//   const updateLabels = labels(svg)
//   const updateTicker = ticker(svg)

//   yield svg.node()

//   for (const keyframe of keyframes) {
//     const transition = svg.transition().duration(duration).ease(d3.easeLinear)

//     // Extract the top bar’s value.
//     x.domain([0, keyframe[1][0].value])

//     updateAxis(keyframe, transition)
//     updateBars(keyframe, transition)
//     updateLabels(keyframe, transition)
//     updateTicker(keyframe, transition)

//     invalidation.then(() => svg.interrupt())
//     await transition.end()
//   }
// }

// function _duration() {
//   return 250
// }

// function _n() {
//   return 12
// }

// function _names(data) {
//   return new Set(data.map((d) => d.name))
// }

// function _datevalues(d3, data) {
//   return Array.from(
//     d3.rollup(
//       data,
//       ([d]) => d.value,
//       (d) => +d.date,
//       (d) => d.name,
//     ),
//   )
//     .map(([date, data]) => [new Date(date), data])
//     .sort(([a], [b]) => d3.ascending(a, b))
// }

// function _rank(names, d3, n) {
//   return function rank(value) {
//     const data = Array.from(names, (name) => ({ name, value: value(name) }))
//     data.sort((a, b) => d3.descending(a.value, b.value))
//     for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i)
//     return data
//   }
// }

// function _k() {
//   return 10
// }

// function _keyframes(d3, datevalues, k, rank) {
//   const keyframes = []
//   let ka, a, kb, b
//   for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
//     for (let i = 0; i < k; ++i) {
//       const t = i / k
//       keyframes.push([
//         new Date(ka * (1 - t) + kb * t),
//         rank((name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t),
//       ])
//     }
//   }
//   keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)])
//   return keyframes
// }

// function _nameframes(d3, keyframes) {
//   return d3.groups(
//     keyframes.flatMap(([, data]) => data),
//     (d) => d.name,
//   )
// }

// function _prev(nameframes, d3) {
//   return new Map(
//     nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])),
//   )
// }

// function _next(nameframes, d3) {
//   return new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
// }

// function _bars(n, color, y, x, prev, next) {
//   return function bars(svg) {
//     let bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect")

//     return ([date, data], transition) =>
//       (bar = bar
//         .data(data.slice(0, n), (d) => d.name)
//         .join(
//           (enter) =>
//             enter
//               .append("rect")
//               .attr("fill", color)
//               .attr("height", y.bandwidth())
//               .attr("x", x(0))
//               .attr("y", (d) => y((prev.get(d) || d).rank))
//               .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
//           (update) => update,
//           (exit) =>
//             exit
//               .transition(transition)
//               .remove()
//               .attr("y", (d) => y((next.get(d) || d).rank))
//               .attr("width", (d) => x((next.get(d) || d).value) - x(0)),
//         )
//         .call((bar) =>
//           bar
//             .transition(transition)
//             .attr("y", (d) => y(d.rank))
//             .attr("width", (d) => x(d.value) - x(0)),
//         ))
//   }
// }

// function _labels(n, x, prev, y, next, textTween) {
//   return function labels(svg) {
//     let label = svg
//       .append("g")
//       .style("font", "bold 12px var(--sans-serif)")
//       .style("font-variant-numeric", "tabular-nums")
//       .attr("text-anchor", "end")
//       .selectAll("text")

//     return ([date, data], transition) =>
//       (label = label
//         .data(data.slice(0, n), (d) => d.name)
//         .join(
//           (enter) =>
//             enter
//               .append("text")
//               .attr(
//                 "transform",
//                 (d) =>
//                   `translate(${x((prev.get(d) || d).value)},${y(
//                     (prev.get(d) || d).rank,
//                   )})`,
//               )
//               .attr("y", y.bandwidth() / 2)
//               .attr("x", -6)
//               .attr("dy", "-0.25em")
//               .text((d) => d.name)
//               .call((text) =>
//                 text
//                   .append("tspan")
//                   .attr("fill-opacity", 0.7)
//                   .attr("font-weight", "normal")
//                   .attr("x", -6)
//                   .attr("dy", "1.15em"),
//               ),
//           (update) => update,
//           (exit) =>
//             exit
//               .transition(transition)
//               .remove()
//               .attr(
//                 "transform",
//                 (d) =>
//                   `translate(${x((next.get(d) || d).value)},${y(
//                     (next.get(d) || d).rank,
//                   )})`,
//               )
//               .call((g) =>
//                 g
//                   .select("tspan")
//                   .tween("text", (d) =>
//                     textTween(d.value, (next.get(d) || d).value),
//                   ),
//               ),
//         )
//         .call((bar) =>
//           bar
//             .transition(transition)
//             .attr("transform", (d) => `translate(${x(d.value)},${y(d.rank)})`)
//             .call((g) =>
//               g
//                 .select("tspan")
//                 .tween("text", (d) =>
//                   textTween((prev.get(d) || d).value, d.value),
//                 ),
//             ),
//         ))
//   }
// }

// function _textTween(d3, formatNumber) {
//   return function textTween(a, b) {
//     const i = d3.interpolateNumber(a, b)
//     return function (t) {
//       this.textContent = formatNumber(i(t))
//     }
//   }
// }

// function _formatNumber(d3) {
//   return d3.format(",d")
// }

// function _tickFormat() {
//   return undefined
// }

// function _axis(marginTop, d3, x, width, tickFormat, barSize, n, y) {
//   return function axis(svg) {
//     const g = svg.append("g").attr("transform", `translate(0,${marginTop})`)

//     const axis = d3
//       .axisTop(x)
//       .ticks(width / 160, tickFormat)
//       .tickSizeOuter(0)
//       .tickSizeInner(-barSize * (n + y.padding()))

//     return (_, transition) => {
//       g.transition(transition).call(axis)
//       g.select(".tick:first-of-type text").remove()
//       g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white")
//       g.select(".domain").remove()
//     }
//   }
// }

// function _ticker(barSize, width, marginTop, n, formatDate, keyframes) {
//   return function ticker(svg) {
//     const now = svg
//       .append("text")
//       .style("font", `bold ${barSize}px var(--sans-serif)`)
//       .style("font-variant-numeric", "tabular-nums")
//       .attr("text-anchor", "end")
//       .attr("x", width - 6)
//       .attr("y", marginTop + barSize * (n - 0.45))
//       .attr("dy", "0.32em")
//       .text(formatDate(keyframes[0][0]))

//     return ([date], transition) => {
//       transition.end().then(() => now.text(formatDate(date)))
//     }
//   }
// }

// function _formatDate(d3) {
//   return d3.utcFormat("%Y")
// }

// function _color(d3, data) {
//   const scale = d3.scaleOrdinal(d3.schemeTableau10)
//   if (data.some((d) => d.category !== undefined)) {
//     const categoryByName = new Map(data.map((d) => [d.name, d.category]))
//     scale.domain(categoryByName.values())
//     return (d) => scale(categoryByName.get(d.name))
//   }
//   return (d) => scale(d.name)
// }

// function _x(d3, marginLeft, width, marginRight) {
//   return d3.scaleLinear([0, 1], [marginLeft, width - marginRight])
// }

// function _y(d3, n, marginTop, barSize) {
//   return d3
//     .scaleBand()
//     .domain(d3.range(n + 1))
//     .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
//     .padding(0.1)
// }

// function _height(marginTop, barSize, n, marginBottom) {
//   return marginTop + barSize * n + marginBottom
// }

// function _barSize() {
//   return 48
// }

// function _marginTop() {
//   return 16
// }

// function _marginRight() {
//   return 6
// }

// function _marginBottom() {
//   return 6
// }

// function _marginLeft() {
//   return 0
// }

// export default function define(runtime, observer) {
//   const main = runtime.module()
//   function toString() {
//     return this.url
//   }
//   const fileAttachments = new Map([
//     [
//       "category-brands.csv",
//       {
//         url: new URL(
//           "./files/aec3792837253d4c6168f9bbecdf495140a5f9bb1cdb12c7c8113cec26332634a71ad29b446a1e8236e0a45732ea5d0b4e86d9d1568ff5791412f093ec06f4f1.csv",
//           import.meta.url,
//         ),
//         mimeType: "text/csv",
//         toString,
//       },
//     ],
//   ])
//   main.builtin(
//     "FileAttachment",
//     runtime.fileAttachments((name) => fileAttachments.get(name)),
//   )
//   main.variable(observer()).define(["md"], _1)
//   main.variable(observer("data")).define("data", ["FileAttachment"], _data)
//   main
//     .variable(observer("viewof replay"))
//     .define("viewof replay", ["html"], _replay)
//   main
//     .variable(observer("replay"))
//     .define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_))
//   main
//     .variable(observer("chart"))
//     .define(
//       "chart",
//       [
//         "replay",
//         "d3",
//         "width",
//         "height",
//         "bars",
//         "axis",
//         "labels",
//         "ticker",
//         "keyframes",
//         "duration",
//         "x",
//         "invalidation",
//       ],
//       _chart,
//     )
//   main.variable(observer("duration")).define("duration", _duration)
//   main.variable(observer("n")).define("n", _n)
//   main.variable(observer("names")).define("names", ["data"], _names)
//   main
//     .variable(observer("datevalues"))
//     .define("datevalues", ["d3", "data"], _datevalues)
//   main.variable(observer("rank")).define("rank", ["names", "d3", "n"], _rank)
//   main.variable(observer("k")).define("k", _k)
//   main
//     .variable(observer("keyframes"))
//     .define("keyframes", ["d3", "datevalues", "k", "rank"], _keyframes)
//   main
//     .variable(observer("nameframes"))
//     .define("nameframes", ["d3", "keyframes"], _nameframes)
//   main.variable(observer("prev")).define("prev", ["nameframes", "d3"], _prev)
//   main.variable(observer("next")).define("next", ["nameframes", "d3"], _next)
//   main
//     .variable(observer("bars"))
//     .define("bars", ["n", "color", "y", "x", "prev", "next"], _bars)
//   main
//     .variable(observer("labels"))
//     .define("labels", ["n", "x", "prev", "y", "next", "textTween"], _labels)
//   main
//     .variable(observer("textTween"))
//     .define("textTween", ["d3", "formatNumber"], _textTween)
//   main
//     .variable(observer("formatNumber"))
//     .define("formatNumber", ["d3"], _formatNumber)
//   main.variable(observer("tickFormat")).define("tickFormat", _tickFormat)
//   main
//     .variable(observer("axis"))
//     .define(
//       "axis",
//       ["marginTop", "d3", "x", "width", "tickFormat", "barSize", "n", "y"],
//       _axis,
//     )
//   main
//     .variable(observer("ticker"))
//     .define(
//       "ticker",
//       ["barSize", "width", "marginTop", "n", "formatDate", "keyframes"],
//       _ticker,
//     )
//   main
//     .variable(observer("formatDate"))
//     .define("formatDate", ["d3"], _formatDate)
//   main.variable(observer("color")).define("color", ["d3", "data"], _color)
//   main
//     .variable(observer("x"))
//     .define("x", ["d3", "marginLeft", "width", "marginRight"], _x)
//   main
//     .variable(observer("y"))
//     .define("y", ["d3", "n", "marginTop", "barSize"], _y)
//   main
//     .variable(observer("height"))
//     .define("height", ["marginTop", "barSize", "n", "marginBottom"], _height)
//   main.variable(observer("barSize")).define("barSize", _barSize)
//   main.variable(observer("marginTop")).define("marginTop", _marginTop)
//   main.variable(observer("marginRight")).define("marginRight", _marginRight)
//   main.variable(observer("marginBottom")).define("marginBottom", _marginBottom)
//   main.variable(observer("marginLeft")).define("marginLeft", _marginLeft)
//   return main
// }
