import { FormControl, Input } from '@chakra-ui/react'
import { BlueButton } from 'components/button'
import { FormBox, FormFlex } from 'components/form'
import { UserHeader } from 'components/header'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
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
      {session && <UserHeader user={session.user} />}
      <FormFlex>
        <FormBox onSubmit={createRoom}>
          <FormControl id="name">
            <Input type="text" placeholder="Room Name" isRequired />
          </FormControl>
          <BlueButton type="submit">新しい Room を作成</BlueButton>
        </FormBox>
      </FormFlex>
    </>
  )
}
