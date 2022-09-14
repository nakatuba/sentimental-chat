import type { Message } from '../interfaces'
import { Avatar, Box, HStack, Stack, Text } from '@chakra-ui/react'

type Props = {
  message: Message
}

export default function MessageBox({ message }: Props) {
  return (
    <Box p={4}>
      <HStack>
        <Avatar src={message.sender.icon?.replace('backend', 'localhost')} />
        <Stack>
          <Text fontWeight="bold">{message.sender.username}</Text>
          <Text whiteSpace="pre-line">{message.body}</Text>
        </Stack>
      </HStack>
    </Box>
  )
}
