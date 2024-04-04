import { Harvest } from "@/types/Harvest"
import { useLocalStorage } from "@mantine/hooks"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { useHarvestUpdateOneMutation } from "./useHarvestUpdateOneMutation"
import { useHarvestCreateOne } from "./useHarvestCreateOneMutation"
import { useHarvestDeleteOnetMutation } from "./useHarvesDeleteOnetMutation"
import { useHarvestsQuery } from "@/hooks/useHarvestsQuery"

export const harvestsLocalStorageKey = "harvests"

type RawHarvest = Omit<Harvest, "id" | "yield_kg_m2">
const parseRawHarvest = ({
  crop,
  date,
  weight_g,
  area_m2,
}: RawHarvest): Harvest => ({
  id: Math.random().toString(), // temporary id
  crop,
  date,
  weight_g,
  area_m2,
  yield_Kg_m2: area_m2 > 0 ? weight_g / 1000 / area_m2 : 0,
})

export const useHarvests = () => {
  const myEmail = useSession().data?.user?.email
  const {
    data: queriedHarvests,
    isPending: queriedHarvestsIsPending,
    isLoading: queriedHarvestsIsLoading,
  } = useHarvestsQuery()

  const [harvestsRaw, setHarvestRaw] = useLocalStorage({
    key: harvestsLocalStorageKey,
    defaultValue: JSON.stringify([]),
  })
  const harvests: Harvest[] = useMemo(
    () => (!myEmail ? (!harvestsRaw ? [] : JSON.parse(harvestsRaw)) : []),
    [harvestsRaw, myEmail],
  )
  const { mutate: harvestCreateOne, isPending: newHarvestIsPending } =
    useHarvestCreateOne()
  const { mutate: harvestDeleteOne, isPending: deleteHarvestIsPending } =
    useHarvestDeleteOnetMutation()
  const { mutate: harvestUpdateOne, isPending: updateHarvestIsPending } =
    useHarvestUpdateOneMutation()

  return {
    harvests: queriedHarvests || harvests,
    createHarvest: (rawHarvest: RawHarvest) => {
      if (newHarvestIsPending) return
      const harvest = parseRawHarvest(rawHarvest)
      return myEmail
        ? harvestCreateOne({ email: myEmail, harvest })
        : setHarvestRaw((prev) => {
            const prevHarvests: Harvest[] = JSON.parse(prev)
            return JSON.stringify([...prevHarvests, harvest])
          })
    },
    updateHarvest: (harvest: RawHarvest) => {
      if (myEmail)
        harvestUpdateOne({ email: myEmail, harvest: parseRawHarvest(harvest) })
    },
    deleteHarvest: (harvestId: string) =>
      myEmail
        ? harvestDeleteOne({ email: myEmail, harvestId })
        : setHarvestRaw((prev) => {
            const prevHarvests: Harvest[] = JSON.parse(prev)
            return JSON.stringify(
              prevHarvests.filter((h) => h.id !== harvestId),
            )
          }),
    isPending:
      !!myEmail &&
      (!!queriedHarvestsIsPending ||
        !!newHarvestIsPending ||
        !!deleteHarvestIsPending ||
        !!updateHarvestIsPending),
    isLoading: queriedHarvestsIsLoading,
  }
}
