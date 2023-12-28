import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import { Combobox, InputBase, useCombobox } from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"
import styled from "styled-components"

const Input = styled(InputBase)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

type Query = ParsedUrlQuery & {
  crop?: string
}

const useTitleData = () => {
  const { data: crops } = useTasksQuery()
  const [titleData, setTitleData] = useState<string[]>([])

  useEffect(() => {
    const titles = crops?.map(({ title }) => title)
    if (titles) {
      setTitleData((prev) => Array.from(new Set(prev.concat(titles))))
    }
  }, [crops])

  return [titleData, setTitleData] as const
}
const SelectCrop: FC<{
  value?: string | null
  onChange?: (value: string | null) => void
  onSubmit: () => void
}> = ({ onSubmit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const ref = useRef<HTMLInputElement>(null)
  useFocusOnLoad(ref)

  const [data, setData] = useTitleData()
  const router = useRouter()
  const query = router.query as Query

  const onChange = (crop: string | null) => {
    if (crop) setQueryOnPage(router, { crop })
  }
  const [search, setSearch] = useState(query.crop ?? "")
  const exactOptionMatch = useMemo(
    () => data.some((item) => item === search),
    [data, search],
  )
  const filteredOptions = useMemo(
    () =>
      exactOptionMatch
        ? data
        : data
            .filter((item) =>
              item.toLowerCase().includes(search.toLowerCase().trim()),
            )
            .sort((a, b) => a.localeCompare(b)),
    [data, exactOptionMatch, search],
  )

  const options = filteredOptions.map((item) => (
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
          setData((current) => [...current, search])
          onChange(search)
        } else {
          onChange(val)
          setSearch(val)
        }

        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <Input
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
          rightSection={
            <ChevronIcon
              onClick={() => {
                onSubmit()
              }}
            />
          }
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              onSubmit()
            }
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">{search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SelectCrop
