import { NewUser, users } from "../modules/user/schema"
import { db } from ".."

export const newUsers: NewUser[] = [
  {
    email: "brunos.garden.app@gmail.com",
    name: "brunos garden",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocL2WXQuc83I2cFO3LFnvyBACUoyfBpQTZqtGsgMMvBL=s96-c",
  },
  {
    email: "oded.winberger@gmail.com",
    name: "Oded Winberger",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIa7eiZTiZSwMEZJxtIJUIfWq1r6p4RbbO3y13_JkkJWTZLZw=s96-c",
  },
  {
    email: "bruno.aeschbacher@gmail.com",
    name: "Bruno Aeschbacher",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLYnZrQ0ahm369-m2KHBDdUoagtjz8WflLLj7_f2ASLbg=s96-c",
  },
]

export const seedUsers = async () => {
  const insertedUsers = await db
    .insert(users)
    .values(newUsers)
    .onConflictDoNothing()
    .returning()
  console.log(`Seeded ${insertedUsers.length} users`, { insertedUsers })
}
