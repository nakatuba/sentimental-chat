import { Box, Flex, FlexProps, Stack } from '@chakra-ui/react'

export function FormFlex({ children, ...props }: FlexProps) {
  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justify="center"
      direction="column"
      gap={8}
      bg="gray.100"
      {...props}
    >
      {children}
    </Flex>
  )
}

type FormBoxProps = {
  children?: React.ReactNode
  onSubmit?: React.FormEventHandler
}

export function FormBox({ children, onSubmit }: FormBoxProps) {
  return (
    <Box rounded="lg" bg="white" boxShadow="lg" width="lg" p={8}>
      <Stack as="form" spacing={8} onSubmit={onSubmit}>
        {children}
      </Stack>
    </Box>
  )
}
