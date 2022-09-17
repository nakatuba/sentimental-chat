import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import moment from 'moment'
import 'moment-timezone'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

moment.tz.setDefault('Asia/Tokyo')

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
