import { db } from ".."
import { harvests, NewHarvest } from "../modules/harvest/schema"
import { newUsers } from "./users"

const newHarvests: NewHarvest[] = [
  {
    crop: "Strawberries",
    date: "05-25-2023",
    weight_g: 2500,
    area_m2: "10",
    yield_Kg_m2: "0.25",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Strawberries",
    date: "06-01-2023",
    weight_g: 2500,
    area_m2: "10",
    yield_Kg_m2: "0.25",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Strawberries",
    date: "06-02-2023",
    weight_g: 3000,
    area_m2: "10",
    yield_Kg_m2: "0.3",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Potatoes",
    date: "07-20-2023",
    weight_g: 50000,
    area_m2: "20",
    yield_Kg_m2: "2.5",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Potatoes",
    date: "07-22-2023",
    weight_g: 25000,
    area_m2: "8",
    yield_Kg_m2: "3.125",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Figs",
    date: "07-31-2023",
    weight_g: 2000,
    area_m2: "1",
    yield_Kg_m2: "2",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Figs",
    date: "08-02-2023",
    weight_g: 1500,
    area_m2: "1",
    yield_Kg_m2: "1.5",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Lettuce",
    date: "04-28-2023",
    weight_g: 1000,
    area_m2: "1",
    yield_Kg_m2: "1",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Lettuce",
    date: "05-03-2023",
    weight_g: 500,
    area_m2: "1",
    yield_Kg_m2: "0.5",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Sweetcorn",
    date: "07-13-2023",
    weight_g: 2000,
    area_m2: "1",
    yield_Kg_m2: "2",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Sweetcorn",
    date: "06-30-2023",
    weight_g: 3000,
    area_m2: "2",
    yield_Kg_m2: "1.5",
    userEmail: newUsers[0].email,
  },
  {
    crop: "Strawberries",
    date: "05-25-2023",
    weight_g: 2500,
    area_m2: "10",
    yield_Kg_m2: "0.25",
    userEmail: newUsers[0].email,
  },
]

export const seedHarvests = async () => {
  const insertedHarvests = await db
    .insert(harvests)
    .values(newHarvests)
    .onConflictDoNothing()
    .returning()
  console.log(`Seeded ${insertedHarvests.length} harvests`, {
    insertedHarvests,
  })
}
