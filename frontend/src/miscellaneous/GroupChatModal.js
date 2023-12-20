import React, { useState } from 'react'
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, } from '@chakra-ui/react'
import { ChatState } from '../Context/Chatprovider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserbadgeItem from '../UserAvatar/UserbadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    //serach the users
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`http://localhost:2000/user?search=${search}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error fetching the users",
                description: `failed to load the users`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }


    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "user already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
        setSelectedUsers([...selectedUsers, userToAdd])

    }

    const handleSubmit = async () => {
        if (!selectedUsers || !groupChatName) {
            toast({
                title: "please fill all details",
                description: `fill all details`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`http://localhost:2000/chats/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            },
                config
            )

            setChats([data, ...chats])
            onclose()
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            toast({
                title: "failed to create the chat",
                description: `failed`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }


    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >Create group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add users eg. John, merry' mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box width="100%"
                            display='flex'
                            flexWrap='wrap'
                        >
                            {selectedUsers.map(u =>
                                <UserbadgeItem key={user._id} user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            )}
                        </Box>
                        {loading ? (
                            <div>loading</div>
                        ) : (
                            searchResult?.slice(0, 4).map((u) => (
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleGroup(u)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal