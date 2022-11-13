import Header from '../components/header'
import MessageBox from '../components/message-box'
import type { Message } from '../interfaces'
import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Textarea,
} from '@chakra-ui/react'
import moment from 'moment'
import type { GetServerSidePropsContext } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import TextareaAutosize from 'react-textarea-autosize'

type Props = {
  messages: Message[]
}

export default function Home(props: Props) {
  const router = useRouter()
  const bottomBoxRef = useRef<HTMLDivElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
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

  useEffect(() => bottomBoxRef.current?.scrollIntoView(), [messages])

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      body: { value: string }
    }
    const res = await fetch('http://localhost:8000/api/messages/send/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: target.body.value,
      }),
    })
    if (!res.ok && res.status === 401) {
      router.push('/login')
    }
    target.body.value = ''
  }

  return (
    <Flex flexDirection="column" bg="gray.100" minH="100vh">
      <Header />
      <Head>
        <title>Sentimental Chat</title>
        <link rel="icon" href="/bird.png" />
      </Head>
      <Box flexGrow={1}>
        {messages.map((message, index) => (
          <Box key={message.id}>
            {(index === 0 ||
              moment(message.created_at).isAfter(
                messages[index - 1].created_at,
                'day'
              )) && (
              <Center>
                <Box
                  px={4}
                  my={2}
                  fontWeight="bold"
                  border="1px"
                  borderColor="gray"
                  borderRadius="full"
                  display="inline-block"
                >
                  {(() => {
                    const messageDate = moment(message.created_at)
                    const today = moment()
                    const yesterday = moment().subtract(1, 'days')

                    if (messageDate.isSame(today, 'day')) {
                      return '今日'
                    } else if (messageDate.isSame(yesterday, 'day')) {
                      return '昨日'
                    } else {
                      return messageDate.format('YYYY年MM月DD日')
                    }
                  })()}
                </Box>
              </Center>
            )}
            <MessageBox message={message} />
          </Box>
        ))}
        <Box ref={bottomBoxRef} />
      </Box>
      <HStack
        as="form"
        p={4}
        spacing={4}
        bg="white"
        position="sticky"
        bottom={0}
        alignItems="end"
        onSubmit={sendMessage}
      >
        <Textarea
          name="body"
          as={TextareaAutosize}
          maxRows={8}
          resize="none"
          onKeyDown={e => {
            if (e.key === 'Enter' && e.shiftKey) {
              e.preventDefault()
              sendButtonRef.current?.click()
            }
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<IoSend />}
          type="submit"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          ref={sendButtonRef}
        ></IconButton>
      </HStack>
    </Flex>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = await getToken({ req: ctx.req })

  const res = await fetch(
    'http://backend:8000/api/messages?ordering=created_at',
    {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    }
  )
  const messages = await res.json()

  if (!res.ok && res.status === 401) {
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
