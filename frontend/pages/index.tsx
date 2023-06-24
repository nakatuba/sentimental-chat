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
import type { Room, User } from 'types'

type Props = {
  user: User
  rooms: Room[]
}

export default function Home(props: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = useState(false)

  const createRoom = async (event: React.FormEvent) => {
    setIsLoadingSubmitButton(true)

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
      } else {
        setIsLoadingSubmitButton(false)
        return
      }
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
        <FormBox onSubmit={createRoom}>
          {props.rooms.length > 0 && (
            <>
              <Heading size="lg">Your Rooms</Heading>
              <Stack alignItems="center">
                {props.rooms.map(room => (
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

  const user = await fetch(`${process.env.BACKEND_HOST}/api/users/me/`, {
    headers: {
      Authorization: `Bearer ${token?.accessToken}`,
    },
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  })

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const rooms = await fetch(
    `${process.env.BACKEND_HOST}/api/users/${user.id}/rooms?ordering=created_at`,
    {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    }
  ).then(res => {
    if (res.ok) {
      return res.json()
    }
  })

  if (rooms)
    return {
      props: {
        user,
        rooms,
      },
    }
}
