import { UserHeader } from 'components/header'
import { MessageBox } from 'components/message-box'
import type { User, Room, Message } from 'types'
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
import InfiniteScroll from 'react-infinite-scroll-component'

type Props = {
  user: User
  room: Room
  messages: {
    next: string | null
    previous: string | null
    results: Message[]
  }
}

export default function Room(props: Props) {
  const router = useRouter()
  const socketRef = useRef<WebSocket>()
  const headerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLDivElement & HTMLFormElement>(null)
  const bottomBoxRef = useRef<HTMLDivElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const { data: session } = useSession()
  const [nextLink, setNextLink] = useState(props.messages.next)
  const [messages, setMessages] = useState(props.messages.results)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [textareaHeight, setTextareaHeight] = useState(0)
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
      setMessages(prevMessages => [data.message, ...prevMessages])
      bottomBoxRef.current?.scrollIntoView()
    }

    return () => {
      socketRef.current?.close()
    }
  }, [])

  useEffect(() => {
    headerRef.current && setHeaderHeight(headerRef.current.clientHeight)
  }, [headerRef.current?.clientHeight])

  useEffect(() => {
    textareaRef.current && setTextareaHeight(textareaRef.current.clientHeight)
  }, [textareaRef.current?.clientHeight])

  const fetchMessages = async () => {
    if (!nextLink) return

    const messages = await fetch(
      nextLink.replace('http://backend', 'http://localhost'),
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    ).then(res => {
      if (res.ok) {
        return res.json()
      }
    })

    if (messages) {
      setMessages(prevMessages => [...prevMessages, ...messages.results])
      setNextLink(messages.next)
    }
  }

  const sendMessage = async (event: React.FormEvent) => {
    setIsLoadingSubmitButton(true)

    event.preventDefault()
    const target = event.target as typeof event.target & {
      body: { value: string }
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/rooms/${props.room.id}/messages/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: target.body.value,
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

    const message = await res.json()

    socketRef.current?.send(JSON.stringify({ message }))

    target.body.value = ''

    setIsLoadingSubmitButton(false)
  }

  return (
    <>
      <UserHeader user={props.user} innerRef={headerRef} showCopyLinkButton>
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
      <Flex
        flexDirection="column"
        pt={`${headerHeight}px`}
        minH="100vh"
        bg="gray.100"
      >
        <Flex
          id="scrollableDiv"
          height={`calc(100vh - ${headerHeight}px - ${textareaHeight}px)`}
          overflow="auto"
          flexDirection="column-reverse"
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchMessages}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            inverse={true}
            hasMore={!!nextLink}
            loader={<></>}
            scrollableTarget="scrollableDiv"
          >
            <Box minH={`calc(100vh - ${headerHeight}px - ${textareaHeight}px)`}>
              {[...messages].reverse().map((message, index, messages) => (
                <Box key={message.id}>
                  {(index === 0
                    ? !nextLink
                    : moment(message.created_at).isAfter(
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
          </InfiniteScroll>
        </Flex>
        <HStack
          as="form"
          p={4}
          spacing={4}
          bg="white"
          position="sticky"
          bottom={0}
          alignItems="end"
          onSubmit={sendMessage}
          ref={textareaRef}
        >
          <Textarea
            name="body"
            as={TextareaAutosize}
            maxRows={8}
            onHeightChange={() =>
              textareaRef.current &&
              setTextareaHeight(textareaRef.current?.clientHeight)
            }
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
      notFound: true
    }
  }

  const messages = await fetch(
    `${process.env.BACKEND_HOST}/api/rooms/${room.id}/messages/`,
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

  return {
    props: {
      user,
      room,
      messages,
    },
  }
}
