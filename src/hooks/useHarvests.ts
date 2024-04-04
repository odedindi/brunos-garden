import { Harvest, RawHarvest } from "@/types/Harvest"
import { useLocalStorage } from "@mantine/hooks"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { useHarvestUpdateOneMutation } from "./useHarvestUpdateOneMutation"
import { useHarvestCreateOne } from "./useHarvestCreateOneMutation"
import { useHarvestDeleteOnetMutation } from "./useHarvesDeleteOnetMutation"
import { useHarvestsQuery } from "@/hooks/useHarvestsQuery"

export const harvestsLocalStorageKey = "harvests"

export const parseRawHarvest = ({
  id,
  crop,
  date,
  weight_g,
  area_m2,
}: RawHarvest): Harvest => ({
  id: id ?? Math.random().toString(), // temporary id
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
  const { mutateAsync: harvestCreateOne, isPending: newHarvestIsPending } =
    useHarvestCreateOne()
  const { mutateAsync: harvestDeleteOne, isPending: deleteHarvestIsPending } =
    useHarvestDeleteOnetMutation()
  const { mutateAsync: harvestUpdateOne, isPending: updateHarvestIsPending } =
    useHarvestUpdateOneMutation()

  return {
    harvests: queriedHarvests || harvests,
    createHarvest: async (rawHarvest: RawHarvest) => {
      if (newHarvestIsPending) return
      const harvest = parseRawHarvest(rawHarvest)

      if (myEmail) {
        const id = await harvestCreateOne({ email: myEmail, harvest })
        harvest.id = id
      } else
        setHarvestRaw((prev) => {
          const prevHarvests: Harvest[] = JSON.parse(prev)
          return JSON.stringify([...prevHarvests, harvest])
        })

      return harvest
    },
    updateHarvest: async (harvest: RawHarvest) => {
      if (myEmail) {
        return await harvestUpdateOne({
          email: myEmail,
          harvest: parseRawHarvest(harvest),
        })
      }
    },
    deleteHarvest: async (harvestId: string) => {
      myEmail
        ? await harvestDeleteOne({ email: myEmail, harvestId })
        : setHarvestRaw((prev) => {
            const prevHarvests: Harvest[] = JSON.parse(prev)
            return JSON.stringify(
              prevHarvests.filter((h) => h.id !== harvestId),
            )
          })
      return harvestId
    },
    isPending:
      !!myEmail &&
      (!!queriedHarvestsIsPending ||
        !!newHarvestIsPending ||
        !!deleteHarvestIsPending ||
        !!updateHarvestIsPending),
    isLoading: queriedHarvestsIsLoading,
  }
}
