import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  // TODO: エラーハンドリング
  const fetchToken = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: target.username.value,
        password: target.password.value,
      }),
    })
    router.push('/')
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
        <Stack as="form" spacing={4} onSubmit={fetchToken}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl>
          <Stack pt={4}>
            <Button
              type="submit"
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
