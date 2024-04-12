import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { User } from "@/db/modules/user"
import { Harvest } from "@/db/modules/harvest"

const useMeQuery = (email?: string | null) =>
  useQuery<(User & { harvests: Harvest[] }) | null>({
    queryKey: ["me", email],
    queryFn: async () => {
      const res = await fetch("api/auth/signin", { method: "POST" })
      if (!res.ok) throw new Error("Network response was not ok")
      return (await res.json()) as User & { harvests: Harvest[] }
    },
    enabled: !!email,
  })

export const useMe = () => {
  const session = useSession()
  const query = useMeQuery(session.data?.user?.email)

  return {
    me: query.data,
    isLoading: query.isLoading || session.status === "loading",
  }
}
