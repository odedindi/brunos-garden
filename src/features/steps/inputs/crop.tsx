import {
  ChangeEvent,
  FC,
  KeyboardEvent,
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
import classes from "./input.module.css"
import { useMe } from "@/hooks/useMe"

interface Query extends ParsedUrlQuery {
  crop?: string
}

const useHarvestData = () => {
  const { me } = useMe()
  const myHarvests = (me?.harvests ?? []).map(({ crop }) => crop)

  const [crops, setCrops] = useState<string[]>(() => [])

  return [
    [...Array.from(new Set([...myHarvests, ...crops]))],
    setCrops,
  ] as const
}

const SelectCrop: FC<{
  onSubmit: () => void
}> = ({ onSubmit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const ref = useRef<HTMLInputElement>(null)
  useFocusOnLoad<"input">(ref)
  const [crops, setNewCrops] = useHarvestData()
  const router = useRouter()
  const query = router.query as Query

  const onChange = (crop: string | null) => setQueryOnPage(router, { crop })

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

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === "$create") {
          setNewCrops((current) => [...current, search])
          onChange(search)
        } else {
          onChange(val)
          setSearch(val)
        }
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
          {Array.from(new Set(filteredOptions)).map((item) => (
            <Combobox.Option value={item} key={item}>
              {item}
            </Combobox.Option>
          ))}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SelectCrop
