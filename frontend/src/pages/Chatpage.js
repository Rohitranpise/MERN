import React from 'react'
import { ChatState } from '../Context/Chatprovider'
import { Box } from '@chakra-ui/react';
import ChatBox from '../miscellaneous/ChatBox';
import MyChats from '../miscellaneous/MyChats';
import Sidedrawer from '../miscellaneous/Sidedrawer';

const Chatpage = () => {

  const { user } = ChatState();
  console.log(user)

  return (
    <div style={{ width: '100%' }}>
      {user && <Sidedrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        width='100%'
        height='91.5vh'
        padding='10px'
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  )
}

export default Chatpage