import { Harvest } from "@/types/Harvest"
import { useLocalStorage } from "@mantine/hooks"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { useHarvestUpdateOneMutation } from "./useHarvestUpdateOneMutation"
import { useHarvestCreateOne } from "./useHarvestCreateOneMutation"
import { useHarvestDeleteOnetMutation } from "./useHarvesDeleteOnetMutation"

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

  const [harvestsRaw] = useLocalStorage({
    key: harvestsLocalStorageKey,
    defaultValue: JSON.stringify([]),
  })
  const Harvests: Harvest[] = useMemo(
    () => (!userEmail || !harvestsRaw ? [] : JSON.parse(harvestsRaw)),
    [harvestsRaw, userEmail],
  )
  const { mutate: harvestCreateOne, isPending: newHarvestIsPending } =
    useHarvestCreateOne()
  const { mutate: harvestDeleteOne } = useHarvestDeleteOnetMutation()
  const { mutate: harvestUpdateOne } = useHarvestUpdateOneMutation()

  const createHarvest = async (harvest: Omit<Harvest, "id" | "harvest">) => {
    if (!userEmail || newHarvestIsPending) return
    harvestCreateOne({ email: userEmail, harvest: newHarvest(harvest) })
  }
  const updateHarvest = (harvest: Harvest) => {
    if (!userEmail) return
    harvestUpdateOne({ email: userEmail, harvest })
  }
  const deleteHarvest = (harvestId: string) => {
    if (!userEmail) return
    harvestDeleteOne({ email: userEmail, harvestId })
  }

  return { Harvests, createHarvest, updateHarvest, deleteHarvest }
}
