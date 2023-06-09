export type User = {
  id: number
  username: string
  icon: string | null
}

export type Room = {
  id: number
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
  id: number
  created_at: string
  sender: User
  body: string
  sentiment_score: SentimentScore | null
}
