import AuthForm from '../components/auth-form'
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [showUnauthrizedError, setShowUnauthrizedError] = useState(false)

  const login = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    signIn('credentials', {
      redirect: false,
      username: target.username.value,
      password: target.password.value,
    }).then(res => {
      if (res?.ok) {
        router.push('/')
      } else {
        setShowUnauthrizedError(true)
      }
    })
  }

  return (
    <AuthForm
      below={
        <Text>
          アカウントをお持ちでない方は{' '}
          <Link color="blue.400" href="/signup">
            新規登録
          </Link>
        </Text>
      }
      onSubmit={login}
    >
      <Stack spacing={4}>
        {showUnauthrizedError && (
          <Alert status="error">
            <AlertIcon />
            ユーザー名またはパスワードが正しくありません
          </Alert>
        )}
        <FormControl
          id="username"
          onChange={() => setShowUnauthrizedError(false)}
        >
          <FormLabel>Username</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl
          id="password"
          onChange={() => setShowUnauthrizedError(false)}
        >
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
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
