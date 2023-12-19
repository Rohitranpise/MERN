import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

const UserbadgeItem = ({ user, handlefunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      colorScheme='purple'
      cursor='pointer'
      onClick={handlefunction}
    >{user.name}
      <CloseIcon pl={1} />
    </Box>
  )
}

export default UserbadgeItem