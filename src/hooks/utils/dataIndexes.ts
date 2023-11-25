export const me = (data: string[][]) => data[0][0]
export const tasks = (data: string[]) =>
  data.slice(1).filter((row) => row.length)
