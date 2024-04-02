import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Combobox, InputBase, useCombobox } from "@mantine/core"
import SubmitButton from "./submitButton"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"
import { useHarvests } from "@/hooks/useHarvests"
import classes from "./input.module.css"

interface Query extends ParsedUrlQuery {
  crop?: string
}

const useHarvestData = () => {
  const { harvests } = useHarvests()
  const [crops, setCrops] = useState<string[]>(
    () => harvests?.map(({ crop }) => crop) ?? [],
  )

  useEffect(() => {
    const crops = harvests.map(({ crop }) => crop)
    if (crops.length) {
      setCrops((prev) => Array.from(new Set(prev.concat(crops))))
    }
  }, [harvests])

  return [crops, setCrops] as const
}
const SelectCrop: FC<{
  onSubmit: () => void
}> = ({ onSubmit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const ref = useRef<HTMLInputElement>(null)
  useFocusOnLoad<"input">(ref)
  const [crops, setCrops] = useHarvestData()
  const router = useRouter()
  const query = router.query as Query

  const onChange = (crop: string | null) => {
    if (crop) setQueryOnPage(router, { crop })
  }
  const [search, setSearch] = useState(query.crop ?? "")
  const exactOptionMatch = useMemo(
    () => crops.some((item) => item === search),
    [crops, search],
  )
  const filteredOptions = useMemo(
    () =>
      exactOptionMatch
        ? crops
        : crops
            .filter((item) =>
              item.toLowerCase().includes(search.toLowerCase().trim()),
            )
            .sort((a, b) => a.localeCompare(b)),
    [crops, exactOptionMatch, search],
  )

  const options = Array.from(new Set(filteredOptions)).map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === "$create") {
          setCrops((current) => [...current, search])
          onChange(search)
        } else {
          onChange(val)
          setSearch(val)
        }
        onSubmit()

        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          className={classes.input}
          ref={ref}
          value={query.crop !== search ? search : query.crop}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            combobox.openDropdown()
            combobox.updateSelectedOptionIndex()
            const val = event.currentTarget.value
            setSearch(val)
            onChange(val)
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown()
            setSearch(query.crop || "")
          }}
          placeholder="Take your pick"
          rightSection={<SubmitButton onClick={onSubmit} />}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") onSubmit()
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SelectCrop
