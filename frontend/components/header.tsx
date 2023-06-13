import {
  Button,
  Flex,
  FlexProps,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { signOut } from 'next-auth/react'
import type { User } from 'types'

type UserHeaderProps = FlexProps & {
  user: User
  showCopyLinkButton?: boolean
}

export function UserHeader({
  user,
  showCopyLinkButton,
  children,
  ...props
}: UserHeaderProps) {
  const toast = useToast()

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
      <HStack flex={1} justifyContent="flex-end" spacing={4}>
        {showCopyLinkButton && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                toast({
                  title: 'Copied link to clipboard',
                  status: 'success',
                })
              })
            }}
          >
            共有リンクをコピー
          </Button>
        )}
        <BlueButton onClick={() => signOut({ callbackUrl: '/login' })}>
          Sign out
        </BlueButton>
      </HStack>
    </Flex>
  )
}
