import AuthForm from '../components/auth-form'
import { Avatar, Box, Button, FormLabel, Input, Stack } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useRef, useState } from 'react'

export default function Signup() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File>()

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
      re_password: { value: string }
    }
    const formData = new FormData()
    if (image) {
      formData.append('icon', image)
    }
    formData.append('username', target.username.value)
    formData.append('password', target.password.value)
    formData.append('re_password', target.re_password.value)

    const res = await fetch('http://localhost:8000/api/users/', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) return

    signIn('credentials', {
      username: target.username.value,
      password: target.password.value,
      callbackUrl: '/',
    })
  }

  return (
    <AuthForm onSubmit={signup}>
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
        <Box>
          <FormLabel>Username</FormLabel>
          <Input name="username" type="text" />
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" />
        </Box>
        <Box>
          <FormLabel>Confirm password</FormLabel>
          <Input name="re_password" type="password" />
        </Box>
      </Stack>
      <Button
        type="submit"
        bg="blue.400"
        color="white"
        _hover={{ bg: 'blue.500' }}
      >
        Sign up
      </Button>
    </AuthForm>
  )
}
