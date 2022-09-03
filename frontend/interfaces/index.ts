export type User = {
  id: number
  username: string
}

export type Message = {
  id: number
  sender: User
  body: string
}
