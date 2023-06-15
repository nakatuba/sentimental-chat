import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { FormBox, FormFlex } from 'components/form'
import { signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [showUnauthrizedError, setShowUnauthrizedError] = useState(false)
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = useState(false)

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
        router.push((router.query.callbackUrl as string) ?? '/')
      } else {
        setShowUnauthrizedError(true)
      }
    })
  }

  return (
    <FormFlex>
      <FormBox
        onSubmit={event => {
          setIsLoadingSubmitButton(true)
          login(event).finally(() => setIsLoadingSubmitButton(false))
        }}
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
        <BlueButton type="submit" isLoading={isLoadingSubmitButton}>
          Sign in
        </BlueButton>
      </FormBox>
      <Text>
        アカウントをお持ちでない方は{' '}
        <NextLink href={{ pathname: '/signup', query: router.query }}>
          <Link color="blue.400">新規登録</Link>
        </NextLink>
      </Text>
    </FormFlex>
  )
}
