import {
  AbsoluteCenter,
  Box,
  Divider,
  FormControl,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { FormBox, FormFlex } from 'components/form'
import { UserHeader } from 'components/header'
import type { GetServerSidePropsContext } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import type { User } from 'types'

type Props = {
  user: User
}

export default function Home(props: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = useState(false)

  const createRoom = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: { value: string }
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/rooms/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: target.name.value,
        }),
      }
    )

    if (!res.ok) {
      if (res.status === 401) {
        router.push('/login')
      }
      return
    }

    const room = await res.json()

    router.push({
      pathname: '/rooms/[id]',
      query: { id: room.id },
    })
  }

  return (
    <>
      <UserHeader user={props.user} />
      <FormFlex>
        <FormBox
          onSubmit={event => {
            setIsLoadingSubmitButton(true)
            createRoom(event).finally(() => setIsLoadingSubmitButton(false))
          }}
        >
          {props.user.rooms.length > 0 && (
            <>
              <Heading size="lg">Your Rooms</Heading>
              <Stack alignItems="center">
                {props.user.rooms.map(room => (
                  <NextLink
                    key={room.id}
                    href={{ pathname: '/rooms/[id]', query: { id: room.id } }}
                  >
                    <Link fontSize="xl" color="blue.400">
                      {room.name}
                    </Link>
                  </NextLink>
                ))}
              </Stack>
              <Box position="relative" py={4}>
                <Divider />
                <AbsoluteCenter bg="white" px={4}>
                  or
                </AbsoluteCenter>
              </Box>
            </>
          )}
          <FormControl id="name">
            <Input type="text" placeholder="Room Name" isRequired />
          </FormControl>
          <BlueButton type="submit" isLoading={isLoadingSubmitButton}>
            新しい Room を作成
          </BlueButton>
        </FormBox>
      </FormFlex>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = await getToken({ req: ctx.req })

  const res = await fetch(`${process.env.BACKEND_HOST}/api/users/me/`, {
    headers: {
      Authorization: `Bearer ${token?.accessToken}`,
    },
  })

  if (!res.ok) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const user = await res.json()

  return {
    props: {
      user,
    },
  }
}
