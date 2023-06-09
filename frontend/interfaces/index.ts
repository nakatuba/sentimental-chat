export type User = {
  id: string
  username: string
  icon: string | null
}

export type Room = {
  id: string
  name: string
  messages: Message[]
}

export type SentimentScore = {
  joy: number
  sadness: number
  anticipation: number
  surprise: number
  anger: number
  fear: number
  disgust: number
  trust: number
}

export type Message = {
  id: string
  created_at: string
  sender: User
  body: string
  sentiment_score: SentimentScore | null
}
