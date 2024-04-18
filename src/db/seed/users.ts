import { NewUser, users } from "../modules/user/schema"
import { db } from ".."

export const SEED_USERS: NewUser[] = JSON.parse(
  process.env.SEED_USERS ?? JSON.stringify([]),
)

export const seedUsers = async () => {
  const insertedUsers = await db
    .insert(users)
    .values(SEED_USERS)
    .onConflictDoNothing()
    .returning()
  console.log(`Seeded ${insertedUsers.length} users`, { insertedUsers })
}
