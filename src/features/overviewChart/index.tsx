import { Harvest } from "@/types/Harvest"
import dayjs from "dayjs"
import { FC, useMemo, useState } from "react"
import "@/config/dayjsExtentions"
import { colorsNames } from "./colorNames"
import StackedBarChart from "./stackedBarChart"
import { get } from "lodash"

const formatData = (harvests: Harvest[]) => {
  const data = harvests
    .map((harvest) => {
      const [date1, date2] = harvest.date.split("_")
      return {
        month: dayjs(date2 && dayjs(date2).isValid() ? date2 : date1).format(
          "MM.YY",
        ),
        data: { [harvest.crop]: harvest.harvest },
      }
    })
    .reduce<({ month: string } & { [crop: string]: number })[]>(
      (acc, harvest) => {
        const { month, data } = harvest
        const monthIndex = acc.findIndex((i) => i.month === month)
        if (monthIndex === -1)
          acc.push({ month } as { month: string } & { [crop: string]: number })

        Object.entries(data).forEach(([crop, harvest = ""]) => {
          const index = monthIndex === -1 ? acc.length - 1 : monthIndex
          if (!acc[index][crop]) acc[index][crop] = 0
          const [harvestNumber] = harvest.split("_")
          acc[index][crop] += harvestNumber ? Number(harvestNumber) : 0
        })
        return acc
      },
      [],
    )
  return data
}

const getAllKeys = (harvests: Harvest[]) =>
  Array.from(new Set(harvests.map((h) => h.crop)))

const getColors = <T extends string>(keys: T[]) =>
  keys.reduce(
    (acc, key, i) => ({
      ...acc,
      [key]: get(colorsNames, (i + 20) % colorsNames.length),
    }),
    {} as Record<T, string>,
  )

const OverviewChart: FC<{ harvests: Harvest[] }> = ({ harvests }) => {
  const { allKeys, colors } = useMemo(() => {
    const allKeys = getAllKeys(harvests)
    return { allKeys, colors: getColors(allKeys) }
  }, [harvests])
  const [keys, setKeys] = useState(allKeys)

  return (
    <>
      <div>
        <StackedBarChart
          data={formatData(harvests)}
          keys={keys}
          colors={colors}
        />
        <div className="fields">
          {allKeys.map((key) => (
            <div key={key} className="field">
              <input
                id={key}
                type="checkbox"
                checked={keys.includes(key)}
                onChange={(e) => {
                  if (e.target.checked)
                    setKeys(Array.from(new Set([...keys, key])))
                  else setKeys(keys.filter((_key) => _key !== key))
                }}
              />
              <label htmlFor={key} style={{ color: colors[key] }}>
                {key}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default OverviewChart
