import { FC, useMemo } from "react"

import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import SelectNumberWithUnit, { Area } from "./numberWithUnit"
import { setQueryOnPage } from "@/utils/setQueryOnPage"

type Query = ParsedUrlQuery & {
  area?: string
}

const SelectArea: FC<{
  onSubmit?: () => void
}> = ({ onSubmit }) => {
  const router = useRouter()
  const query = router.query as Query

  const area = useMemo(
    () =>
      (query.area ?? "").split("_").reduce<{ value?: number; unit: Area }>(
        (acc, snippet) => {
          if (Number(snippet)) return { ...acc, value: Number(snippet) }
          return snippet ? { ...acc, unit: snippet as Area } : acc
        },
        { unit: "m2" },
      ),
    [query.area],
  )

  const onChange = ({ value, unit }: { value?: number; unit?: Area }) =>
    setQueryOnPage(router, {
      area:
        value || unit ? `${value ?? area?.value}_${unit ?? area?.unit}` : [],
    })

  return (
    <SelectNumberWithUnit
      value={area?.value}
      onChange={(value) => onChange({ value })}
      unit={area.unit ?? "m2"}
      onUnitChange={(unit) => onChange({ unit: unit as Area })}
      onSubmit={onSubmit}
      placeholder="Area"
    />
  )
}

export default SelectArea
