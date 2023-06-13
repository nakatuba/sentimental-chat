import { Box, BoxProps, Flex, FlexProps, Stack } from '@chakra-ui/react'

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

export function FormBox({ children, ...props }: BoxProps) {
  return (
    <Box
      as="form"
      rounded="lg"
      bg="white"
      boxShadow="lg"
      width="lg"
      p={8}
      {...props}
    >
      <Stack spacing={8}>{children}</Stack>
    </Box>
  )
}
