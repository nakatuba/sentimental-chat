import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { FormBox, FormFlex } from 'components/form'
import { signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export default function Signup() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File>()
  const [showPassword, setShowPassword] = useState(false)
  const [usernameErrorMessages, setUsernameErrorMessages] = useState([])
  const [passwordErrorMessages, setPasswordErrorMessages] = useState([])
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = useState(false)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      setImage(event.target.files[0])
    }
  }

  const deleteImage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setImage(undefined)
  }

  const signup = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    const formData = new FormData()
    image && formData.append('icon', image)
    formData.append('username', target.username.value)
    formData.append('password', target.password.value)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/users/`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!res.ok) {
      const errorMessage = await res.json()
      errorMessage.username && setUsernameErrorMessages(errorMessage.username)
      errorMessage.password && setPasswordErrorMessages(errorMessage.password)
      return
    }

    signIn('credentials', {
      username: target.username.value,
      password: target.password.value,
      callbackUrl: (router.query.callbackUrl as string) ?? '/',
    })
  }

  return (
    <FormFlex>
      <FormBox
        onSubmit={event => {
          setIsLoadingSubmitButton(true)
          signup(event).finally(() => setIsLoadingSubmitButton(false))
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={4} px={24}>
            <Avatar
              src={image && URL.createObjectURL(image)}
              size="2xl"
              mx="auto"
            />
            <Input
              type="file"
              accept="image/*"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={uploadImage}
            />
            <Button onClick={() => inputRef.current?.click()}>
              画像をアップロード
            </Button>
            <Button color="blue.400" variant="link" onClick={deleteImage}>
              画像を削除
            </Button>
          </Stack>
          <FormControl
            id="username"
            isRequired
            isInvalid={usernameErrorMessages.length > 0}
            onChange={() => setUsernameErrorMessages([])}
          >
            <FormLabel>Username</FormLabel>
            <Input type="text" />
            {usernameErrorMessages.map((errorMessage, index) => (
              <FormErrorMessage key={index}>{errorMessage}</FormErrorMessage>
            ))}
          </FormControl>
          <FormControl
            id="password"
            isRequired
            isInvalid={passwordErrorMessages.length > 0}
            onChange={() => setPasswordErrorMessages([])}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'} />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {passwordErrorMessages.map((errorMessage, index) => (
              <FormErrorMessage key={index}>{errorMessage}</FormErrorMessage>
            ))}
          </FormControl>
        </Stack>
        <BlueButton type="submit" isLoading={isLoadingSubmitButton}>
          Sign up
        </BlueButton>
      </FormBox>
      <Text>
        すでにアカウントをお持ちの方は{' '}
        <NextLink href={{ pathname: '/login', query: router.query }}>
          <Link color="blue.400">ログイン</Link>
        </NextLink>
      </Text>
    </FormFlex>
  )
}
