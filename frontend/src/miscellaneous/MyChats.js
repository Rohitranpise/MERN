import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/ChatLogic'
import GroupChatModal from './GroupChatModal'
import UserListItem from '../UserAvatar/UserListItem'

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoaggedUser] = useState()
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const { selectedChat, setSelectedChat, setChats, chats, user } = ChatState()
  const toast = useToast();

  const handleGroup = async () => {

  }

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:2000/chats`, config)
      setChats(data)
      return;
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: `failed to load the chats`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }
  }
  useEffect(() => {
    setLoaggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChat()
  }, [fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? 'none' : "flex", md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: "31%" }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work sans'
        display='flex'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >My Chats
        <GroupChatModal>
          {loading ? (
            <div>loading</div>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}
              />
            ))
          )}

          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        width='100%'
        height='100%'
        borderRadius='lg'
        overflowY='hidden'
      >{chats ? (
        <>
          <Stack overflowY='scroll'>
            {
              chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </Text>
                </Box>
              ))
            }
          </Stack>
        </>
      ) : (<>
        <ChatLoading />
      </>
      )}</Box>
    </Box >
  )
}

export default MyChats