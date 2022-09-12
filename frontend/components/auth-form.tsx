import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  onSubmit?: React.FormEventHandler
}

export default function AuthForm({ children, onSubmit }: Props) {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        rounded="lg"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="lg"
        minW="lg"
        p={8}
      >
        <Stack as="form" spacing={8} onSubmit={onSubmit}>
          {children}
        </Stack>
      </Box>
    </Flex>
  )
}
