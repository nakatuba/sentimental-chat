import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
