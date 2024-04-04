import { FC, useMemo } from "react"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import SelectNumberWithUnit, { Weight } from "./numberWithUnit"
import { setQueryOnPage } from "@/utils/setQueryOnPage"

interface Query extends ParsedUrlQuery {
  weight?: string
}

const SelectWeight: FC<{
  onSubmit?: () => void
}> = ({ onSubmit }) => {
  const router = useRouter()
  const query = router.query as Query

  const weight = useMemo(
    () =>
      (query.weight ?? "").split("_").reduce<{ value?: number; unit: Weight }>(
        (acc, snippet) => {
          if (Number(snippet)) return { ...acc, value: Number(snippet) }
          return snippet ? { ...acc, unit: snippet as Weight } : acc
        },
        { unit: "kg" },
      ),
    [query.weight],
  )

  const onChange = ({ value, unit }: { value?: number; unit?: Weight }) =>
    setQueryOnPage(router, {
      weight:
        value || unit
          ? `${value ?? weight?.value}_${unit ?? weight?.unit}`
          : null,
    })

  return (
    <SelectNumberWithUnit
      value={weight?.value}
      onChange={(value) => onChange({ value })}
      unit={weight.unit ?? "kg"}
      onUnitChange={(unit) => onChange({ unit: unit as Weight })}
      onSubmit={onSubmit}
      placeholder="Weight"
      focusOnLoad
    />
  )
}

export default SelectWeight
