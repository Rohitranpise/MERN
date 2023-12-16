import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast, } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { Spinner } from '@chakra-ui/spinner'


const Sidedrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const toast = useToast()
  const { user, setSelectedChat, chats, setChats } = ChatState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()


  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:2000/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: "Error occured!",
        description: 'failed to load the search results!',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoading(true)

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post(`http://localhost:2000/chats`, { userId }, config)
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

      setSelectedChat(data)
      setLoadingChat(false)
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent="space-between"
        alignItems='center'
        bg='white'
        width='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label="search users">
          <Button variant='ghost' onClick={onOpen}>
            <Search2Icon />
            <Text display={{ base: 'none', md: 'flex' }} px="4">Search user</Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans'>
          Chat n Meet
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize='2xl' m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.user.name} src={user.user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">search users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              >
              </Input>
              <Button
                onClick={handleSearch}
              >Go</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => {
                  { console.log(user) }
                  return (
                    < UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() =>
                        accessChat(user._id)
                      }
                    />
                  )
                })
              )
            }
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Sidedrawer