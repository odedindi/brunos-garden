import { FC, useEffect, useMemo, useState } from "react"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import { Combobox, InputBase, useCombobox } from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { setQueryOnPage } from "@/utils/setQueryOnPage"

type Query = ParsedUrlQuery & {
  title?: string
}

const useTitleData = () => {
  const { data: tasks } = useTasksQuery()
  const [titleData, setTitleData] = useState<string[]>([])

  useEffect(() => {
    const titles = tasks?.map(({ title }) => title)
    if (titles) {
      setTitleData((prev) => Array.from(new Set(prev.concat(titles))))
    }
  }, [tasks])

  return [titleData, setTitleData] as const
}
const SelectTitle: FC<{
  value?: string | null
  onChange?: (value: string | null) => void
  onSubmit: () => void
}> = ({ onSubmit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [data, setData] = useTitleData()
  const router = useRouter()
  const query = router.query as Query

  const onChange = (title: string | null) => {
    if (title) setQueryOnPage(router, { title })
  }
  const [search, setSearch] = useState(query.title ?? "")
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
        <InputBase
          value={query.title !== search ? search : query.title}
          onChange={(event) => {
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
            setSearch(query.title || "")
          }}
          placeholder="Take your pick"
          rightSection={
            <ChevronIcon
              onClick={() => {
                onSubmit()
              }}
            />
          }
          onKeyDown={(event) => {
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

export default SelectTitle
