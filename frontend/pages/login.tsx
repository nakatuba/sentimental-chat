import AuthForm from '../components/auth-form'
import { Box, Button, FormLabel, Input, Stack } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

export default function Login() {
  const login = async (event: React.FormEvent) => {
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
    <AuthForm onSubmit={login}>
      <Stack spacing={4}>
        <Box>
          <FormLabel>Username</FormLabel>
          <Input name="username" type="text" />
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" />
        </Box>
      </Stack>
      <Button
        type="submit"
        bg="blue.400"
        color="white"
        _hover={{ bg: 'blue.500' }}
      >
        Sign in
      </Button>
    </AuthForm>
  )
}
