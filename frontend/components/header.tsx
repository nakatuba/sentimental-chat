import { Flex, FlexProps, HStack, Text } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import type { Room, User } from 'interfaces'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export function Header({ children, ...props }: FlexProps) {
  return (
    <Flex
      p={4}
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      w="100%"
      zIndex={2}
      bg="white"
      {...props}
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
    <Header>
      <HStack spacing={4}>
        <Avatar
          src={user.icon?.replace('http://backend', 'http://localhost')}
        />
        <Text fontSize="xl" fontWeight="bold">
          {user.username}
        </Text>
      </HStack>
      <HStack>
        <BlueButton onClick={() => signOut({ callbackUrl: '/login' })}>
          Sign out
        </BlueButton>
      </HStack>
    </Header>
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
          {room.name}
        </Text>
      </HStack>
      <HStack>
        <BlueButton onClick={() => router.push('/')}>退出する</BlueButton>
      </HStack>
    </Header>
  )
}
