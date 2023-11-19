export type Attribute = {
  id: string
  description: string
}
export type Task = {
  id: string
  title: string
  description: string
  schedule?: Date | null
  completed?: boolean
  attributes: Attribute[]
  tags: string[]
}
