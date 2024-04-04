import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import * as dataIndex from "./utils/dataIndexes"
import { useLocalStorage } from "@mantine/hooks"
import { Harvest, HarvestSchema } from "@/types/Harvest"
import { harvestsLocalStorageKey } from "./useHarvests"

export const useHarvestsQuery = () => {
  const [_, setHarvests] = useLocalStorage({
    key: harvestsLocalStorageKey,
  })

  const { data: session } = useSession()
  const email = session?.user?.email
  return useQuery<Harvest[]>({
    queryKey: ["harvests", email],
    queryFn: async () => {
      const res = await fetch("api/sheet", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      const rawData = await res.json()

      const data: string[] = rawData ? JSON.parse(rawData) : []
      const harvestsStr: string[] =
        data.length > 1 ? dataIndex.harvests(data) : []
      try {
        const harvests = harvestsStr.map((str: string) => {
          const parsed = JSON.parse(str)
          return HarvestSchema.parse(parsed)
        })

        setHarvests(JSON.stringify(harvests))
        return harvests
      } catch (error) {
        console.log(error)
      }
      return []
    },
    enabled: !!email,
  })
}
