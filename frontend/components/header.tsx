import { Box, Button, Container, Flex, HStack } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'

export default function Header() {
  return (
    <Flex p={4} alignItems="center" justifyContent="space-between">
      <HStack />
      <HStack>
        <Button
          type="submit"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          onClick={() => signOut({ callbackUrl: '/signin' })}
        >
          Sign out
        </Button>
      </HStack>
    </Flex>
  )
}
