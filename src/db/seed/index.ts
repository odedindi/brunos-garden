import { seedHarvests } from "./harvests"
import { seedUsers } from "./users"

const seed = async () => {
  await seedUsers()
  await seedHarvests()
}

seed()
  .then(() => {
    console.log("Seeding completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error during seeding:", error)
    process.exit(1)
  })
