import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

export default function Login() {
  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    signIn('credentials', {
      username: target.username.value,
      password: target.password.value,
      callbackUrl: '/',
    })
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        rounded="lg"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="lg"
        minW="lg"
        p={8}
      >
        <Stack as="form" spacing={4} onSubmit={authenticate}>
          <Box>
            <FormLabel>Username</FormLabel>
            <Input name="username" type="text" />
          </Box>
          <Box>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" />
          </Box>
          <Stack pt={4}>
            <Button
              type="submit"
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
