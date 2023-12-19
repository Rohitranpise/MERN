import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({ user, handleFunction }) => {

    return (
        <Box
            onClick={handleFunction}
            cursor='pointer'
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                // color: 'white'
            }}
            width="100%"
            display='flex'
            alignItems='center'
            color='black'
            px={20}
            py={2}
            borderRadius='lg'
        >
            <Avatar
                ml={3}
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}
            >
                <Box
                    ml={4}
                >
                    <Text color='black'>{user.name}</Text>
                    <Text fontSize="xs" color='black'>
                            <b>Email:</b>
                        {user.email}
                    </Text>
                </Box>
            </Avatar>
        </Box>
    )
}

export default UserListItem