import type { User } from '../interfaces'
import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'

type Props = {
  user: User
}

export default function Header({ user }: Props) {
  return (
    <Flex
      p={4}
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top={0}
      bg="white"
      zIndex={2}
    >
      <HStack spacing={4}>
        <Avatar src={user.icon} />
        <Text fontSize="xl" fontWeight="bold">
          {user.username}
        </Text>
      </HStack>
      <HStack>
        <Button
          type="submit"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign out
        </Button>
      </HStack>
    </Flex>
  )
}
