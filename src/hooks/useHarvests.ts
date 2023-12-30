import { Harvest } from "@/types/Harvest"
import { useLocalStorage } from "@mantine/hooks"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { useHarvestUpdateOneMutation } from "./useHarvestUpdateOneMutation"
import { useHarvestCreateOne } from "./useHarvestCreateOneMutation"
import { useHarvestDeleteOnetMutation } from "./useHarvesDeleteOnetMutation"
import { useHarvestsQuery } from "@/hooks/useHarvestsQuery"

export const harvestsLocalStorageKey = "harvests"

const newHarvest = ({
  crop: title,
  date,
  weight,
  area,
}: Omit<Harvest, "id" | "harvest">): Harvest => {
  const [areaNum, areaUnit] = area.split("_")
  const [weightNum, weightUnit] = weight.split("_")
  const weightCorrected = weightNum
    ? weightUnit === "g"
      ? Number(weightNum) / 1000
      : Number(weightNum)
    : 0
  return {
    id: Math.random().toString(),
    crop: title,
    date,
    weight,
    area,
    harvest: `${weightCorrected / Number(areaNum)}_Kg/${areaUnit}`,
  }
}

export const useHarvests = () => {
  const userEmail = useSession().data?.user?.email
  const { data: queriedHarvests, isPending: queriedHarvestsIsPending } =
    useHarvestsQuery()

  const [harvestsRaw, setHarvestRaw] = useLocalStorage({
    key: harvestsLocalStorageKey,
    defaultValue: JSON.stringify([]),
  })
  const harvests: Harvest[] = useMemo(
    () => (!userEmail ? (!harvestsRaw ? [] : JSON.parse(harvestsRaw)) : []),
    [harvestsRaw, userEmail],
  )
  const { mutate: harvestCreateOne, isPending: newHarvestIsPending } =
    useHarvestCreateOne()
  const { mutate: harvestDeleteOne, isPending: deleteHarvestIsPending } =
    useHarvestDeleteOnetMutation()
  const { mutate: harvestUpdateOne, isPending: updateHarvestIsPending } =
    useHarvestUpdateOneMutation()

  const createHarvest = async (harvest: Omit<Harvest, "id" | "harvest">) => {
    if (newHarvestIsPending) return
    if (!userEmail)
      return setHarvestRaw((prev) => {
        const prevHarvests = JSON.parse(prev)
        return JSON.stringify([...prevHarvests, newHarvest(harvest)])
      })
    harvestCreateOne({ email: userEmail, harvest: newHarvest(harvest) })
  }
  const updateHarvest = (harvest: Harvest) => {
    if (!userEmail) return
    harvestUpdateOne({ email: userEmail, harvest })
  }
  const deleteHarvest = (harvestId: string) => {
    if (!userEmail)
      return setHarvestRaw((prev) => {
        const prevHarvests: Harvest[] = JSON.parse(prev)
        return JSON.stringify(prevHarvests.filter((h) => h.id !== harvestId))
      })
    harvestDeleteOne({ email: userEmail, harvestId })
  }

  return {
    harvests: queriedHarvests || harvests,
    createHarvest,
    updateHarvest,
    deleteHarvest,
    isPending:
      !!userEmail &&
      (!!queriedHarvestsIsPending ||
        !!newHarvestIsPending ||
        !!deleteHarvestIsPending ||
        !!updateHarvestIsPending),
  }
}
