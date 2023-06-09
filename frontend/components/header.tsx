import type { Room, User } from '../interfaces'
import { BlueButton } from './button'
import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

type HeaderProps = {
  children?: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <Flex
      p={4}
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      w="100%"
      zIndex={2}
      bg="white"
    >
      {children}
    </Flex>
  )
}

type UserHeaderProps = {
  user: User
}

export function UserHeader({ user }: UserHeaderProps) {
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
        <Avatar
          src={user.icon?.replace('http://backend', 'http://localhost')}
        />
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

type RoomHeaderProps = {
  room: Room
}

export function RoomHeader({ room }: RoomHeaderProps) {
  const router = useRouter()

  return (
    <Header>
      <HStack>
        <Text fontSize="xl" fontWeight="bold">
          {room.id}
        </Text>
      </HStack>
      <HStack>
        <BlueButton onClick={() => router.push('/')}>退出する</BlueButton>
      </HStack>
    </Header>
  )
}
