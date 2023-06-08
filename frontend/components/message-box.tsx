import type { Message } from '../interfaces'
import { Avatar, Box, HStack, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'

type Props = {
  message: Message
}

const JOY = String.fromCodePoint(0x1f604) // 😄
const SADNESS = String.fromCodePoint(0x1f62d) // 😭
const ANTICIPATION = String.fromCodePoint(0x1f929) // 🤩
const SURPRISE = String.fromCodePoint(0x1f633) // 😳
const ANGER = String.fromCodePoint(0x1f621) // 😡
const FEAR = String.fromCodePoint(0x1f628) // 😨
const DISGUST = String.fromCodePoint(0x1f616) // 😖
const TRUST = String.fromCodePoint(0x1f970) // 🥰

export default function MessageBox({ message }: Props) {
  const emotions = [
    { emoji: JOY, score: message.sentiment_score?.joy ?? 0 },
    { emoji: SADNESS, score: message.sentiment_score?.sadness ?? 0 },
    { emoji: ANTICIPATION, score: message.sentiment_score?.anticipation ?? 0 },
    { emoji: SURPRISE, score: message.sentiment_score?.surprise ?? 0 },
    { emoji: ANGER, score: message.sentiment_score?.anger ?? 0 },
    { emoji: FEAR, score: message.sentiment_score?.fear ?? 0 },
    { emoji: DISGUST, score: message.sentiment_score?.disgust ?? 0 },
    { emoji: TRUST, score: message.sentiment_score?.trust ?? 0 },
  ]
  const emotion = emotions.sort((a, b) => b.score - a.score)[0]

  return (
    <Box p={4}>
      <HStack alignItems="start" spacing={4}>
        <Avatar
          src={message.sender.icon?.replace(
            'http://backend',
            'http://localhost'
          )}
        >
          {emotion.score > 0.5 && (
            <Text fontSize="2xl" position="absolute" top={6} left={8}>
              {emotion.emoji}
            </Text>
          )}
        </Avatar>
        <Stack>
          <HStack>
            <Text fontWeight="bold">{message.sender.username}</Text>
            <Text>{moment(message.created_at).format('HH:mm')}</Text>
          </HStack>
          <Text whiteSpace="pre-line">{message.body}</Text>
        </Stack>
      </HStack>
    </Box>
  )
}
