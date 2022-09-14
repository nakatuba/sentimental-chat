import { Box, Flex, Stack } from '@chakra-ui/react'

type Props = {
  children?: React.ReactNode
  below?: React.ReactNode
  onSubmit?: React.FormEventHandler
}

export default function AuthForm({ children, below, onSubmit }: Props) {
  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justify="center"
      direction="column"
      gap={8}
      bg="gray.100"
    >
      <Box rounded="lg" bg="white" boxShadow="lg" width="lg" p={8}>
        <Stack as="form" spacing={8} onSubmit={onSubmit}>
          {children}
        </Stack>
      </Box>
      {below}
    </Flex>
  )
}
