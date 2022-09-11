export type User = {
  id: number
  username: string
  icon: string
}

export type Message = {
  id: number
  sender: User
  body: string
}
