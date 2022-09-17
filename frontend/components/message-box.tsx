import type { Message } from '../interfaces'
import { Avatar, Box, HStack, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'

type Props = {
  message: Message
}

const JOY_EMOJI = String.fromCodePoint(0x1f604) // 😄
const SADNESS_EMOJI = String.fromCodePoint(0x1f62d) // 😭
const ANTICIPATION_EMOJI = String.fromCodePoint(0x1f913) // 🤓
const SURPRISE_EMOJI = String.fromCodePoint(0x1f633) // 😳
const ANGER_EMOJI = String.fromCodePoint(0x1f621) // 😡
const FEAR_EMOJI = String.fromCodePoint(0x1f628) // 😨
const DISGUST_EMOJI = String.fromCodePoint(0x1f616) // 😖
const TRUST_EMOJI = String.fromCodePoint(0x1f91d) // 🤝

export default function MessageBox({ message }: Props) {
  const emojis: string[] = []
  if (message.sentiment_score) {
    if (message.sentiment_score.joy > 0.5) emojis.push(JOY_EMOJI)
    if (message.sentiment_score.sadness > 0.5) emojis.push(SADNESS_EMOJI)
    if (message.sentiment_score.anticipation > 0.5)
      emojis.push(ANTICIPATION_EMOJI)
    if (message.sentiment_score.surprise > 0.5) emojis.push(SURPRISE_EMOJI)
    if (message.sentiment_score.anger > 0.5) emojis.push(ANGER_EMOJI)
    if (message.sentiment_score.fear > 0.5) emojis.push(FEAR_EMOJI)
    if (message.sentiment_score.disgust > 0.5) emojis.push(DISGUST_EMOJI)
    if (message.sentiment_score.trust > 0.5) emojis.push(TRUST_EMOJI)
  }

  return (
    <Box p={4}>
      <HStack alignItems="start">
        <Avatar src={message.sender.icon?.replace('backend', 'localhost')} />
        <Stack>
          <HStack>
            <Text fontWeight="bold">{message.sender.username}</Text>
            <Text>{moment(message.created_at).format('HH:mm')}</Text>
            <Text>{emojis.join(' ')}</Text>
          </HStack>
          <Text whiteSpace="pre-line">{message.body}</Text>
        </Stack>
      </HStack>
    </Box>
  )
}
