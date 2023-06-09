import { Button, ButtonProps } from '@chakra-ui/react'

export function BlueButton({ children, ...props }: ButtonProps) {
  return (
    <Button bg="blue.400" color="white" _hover={{ bg: 'blue.500' }} {...props}>
      {children}
    </Button>
  )
}
