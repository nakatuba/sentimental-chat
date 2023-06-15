import { UserHeader } from 'components/header'
import { MessageBox } from 'components/message-box'
import type { User, Room } from 'types'
import {
  Box,
  Text,
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
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import TextareaAutosize from 'react-textarea-autosize'
import { IoChevronBack } from 'react-icons/io5'

type Props = {
  user: User
  room: Room
}

export default function Room(props: Props) {
  const router = useRouter()
  const socketRef = useRef<WebSocket>()
  const bottomBoxRef = useRef<HTMLDivElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const { data: session } = useSession()
  const [messages, setMessages] = useState(props.room.messages)
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = useState(false)

  useEffect(() => {
    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST?.replace(
        /^http(s)?\:\/\//,
        'ws$1://'
      )}/ws/chat/${props.room.id}/`
    )

    socketRef.current.onmessage = function (e) {
      const data = JSON.parse(e.data)
      setMessages(prevMessages => [...prevMessages, data.message])
    }

    return () => {
      socketRef.current?.close()
    }
  }, [])

  useEffect(() => bottomBoxRef.current?.scrollIntoView(), [messages])

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      body: { value: string }
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/messages/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: props.room.id,
          body: target.body.value,
        }),
      }
    )

    if (!res.ok) {
      if (res.status === 401) {
        router.push('/login')
      }
      return
    }

    const message = await res.json()

    socketRef.current?.send(JSON.stringify({ message }))

    target.body.value = ''
  }

  return (
    <>
      <UserHeader user={props.user} showCopyLinkButton>
        <HStack position="relative">
          <IconButton
            aria-label="Exit room"
            icon={<IoChevronBack size={32} />}
            bg="white"
            color="blue.400"
            position="absolute"
            left={-12}
            onClick={() => router.push('/')}
          />
          <Text fontSize="xl" fontWeight="bold">
            {props.room.name}
          </Text>
        </HStack>
      </UserHeader>
      <Flex flexDirection="column" pt={24} minH="100vh" bg="gray.100">
        <Box flex={1}>
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
          onSubmit={async event => {
            setIsLoadingSubmitButton(true)
            await sendMessage(event)
            setIsLoadingSubmitButton(false)
          }}
        >
          <Textarea
            name="body"
            as={TextareaAutosize}
            maxRows={8}
            resize="none"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.metaKey) {
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
            isLoading={isLoadingSubmitButton}
            ref={sendButtonRef}
          />
        </HStack>
      </Flex>
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

  const room = await fetch(
    `${process.env.BACKEND_HOST}/api/rooms/${ctx.query.id}/`,
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

  if (!room) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      room,
    },
  }
}
