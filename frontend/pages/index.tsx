import { Box, Flex, FormControl, Input, Stack } from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { UserHeader } from 'components/header'
import type { User } from 'interfaces'
import type { GetServerSidePropsContext } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type Props = {
  user: User
}

export default function Home(props: Props) {
  const router = useRouter()
  const { data: session } = useSession()

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
      <Flex
        minH="100vh"
        alignItems="center"
        justify="center"
        direction="column"
        gap={8}
        bg="gray.100"
      >
        <Box rounded="lg" bg="white" boxShadow="lg" width="lg" p={8}>
          <Stack as="form" spacing={8} onSubmit={createRoom}>
            <FormControl id="name">
              <Input type="text" placeholder="Room Name" isRequired />
            </FormControl>
            <BlueButton type="submit">新しい Room を作成</BlueButton>
          </Stack>
        </Box>
      </Flex>
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
