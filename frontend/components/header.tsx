import { Flex, FlexProps, HStack, Text } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { signOut } from 'next-auth/react'
import type { User } from 'types'

type UserHeaderProps = FlexProps & {
  user: User
}

export function UserHeader({ user, children, ...props }: UserHeaderProps) {
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
      <HStack flex={1} spacing={4}>
        <Avatar
          src={user.icon?.replace('http://backend', 'http://localhost')}
        />
        <Text fontSize="xl" fontWeight="bold">
          {user.username}
        </Text>
      </HStack>
      {children}
      <HStack flex={1} justifyContent="flex-end">
        <BlueButton onClick={() => signOut({ callbackUrl: '/login' })}>
          Sign out
        </BlueButton>
      </HStack>
    </Flex>
  )
}
