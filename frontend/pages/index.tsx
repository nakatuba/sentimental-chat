import Header from '../components/header'
import type { Message } from '../interfaces'
import { Box, Button, HStack, Input } from '@chakra-ui/react'
import type { GetServerSidePropsContext } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

type Props = {
  messages: Message[]
}

export default function Home(props: Props) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState(props.messages)
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  })

  useEffect(() => {
    const channel = pusher.subscribe('public-channel')

    channel.bind('send-event', function (data: Message) {
      setMessages([...messages, data])
    })

    return () => pusher.unsubscribe('public-channel')
  })

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      body: { value: string }
    }
    await fetch('http://localhost:8000/api/send/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: target.body.value,
      }),
    })
    target.body.value = ''
  }

  return (
    <>
      <Header />
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {messages.map(message => (
        <Box key={message.id}>{message.body}</Box>
      ))}
      <HStack as="form" onSubmit={sendMessage}>
        <Input name="body" />
        <Button type="submit">send</Button>
      </HStack>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = await getToken({ req: ctx.req })

  const res = await fetch('http://backend:8000/api/messages/', {
    headers: {
      Authorization: `Bearer ${token?.accessToken}`,
    },
  })
  const messages = await res.json()

  if (!res.ok) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      messages,
    },
  }
}
