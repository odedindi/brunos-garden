import { useSession } from "next-auth/react"

import { User, UserSchema } from "@/types/User"
import { useQuery } from "@tanstack/react-query"

import * as dataIndex from "./utils/dataIndexes"
import { useUserUpdateOneMutation } from "./useUserUpdateOneMutation"

export const useMe = () => {
  const { data: session } = useSession()
  const email = session?.user?.email
  const { data, isLoading } = useQuery<User | null>({
    queryKey: ["me", email],
    queryFn: async () => {
      const res = await fetch("api/sheet", {
        method: "POST",
        body: JSON.stringify({ email: email }),
      })
      const rawData = await res.json()
      const data: string[][] = rawData ? JSON.parse(rawData) : []
      const userStr = data.length ? dataIndex.me(data) : "{}"

      const user = UserSchema.safeParse(JSON.parse(userStr))
      if (!user.success) console.info(user.error)
      return user.success ? user.data : null
    },
    enabled: !!email,
  })

  const { mutateAsync: updateMe, isPending } = useUserUpdateOneMutation()

  return {
    me: data,
    isLoading,
    updateMe,
    isPending,
  }
}
