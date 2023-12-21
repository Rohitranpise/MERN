import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import UserbadgeItem from '../UserAvatar/UserbadgeItem'
import axios from 'axios'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat, user } = ChatState();

    const toast = useToast();

    const handleRemove = () => { }

    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`http://localhost:2000/chats/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setSelectedChat(data)
            console.log('error')
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: `failed to load the chats`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            setRenameLoading(false);
        }

        setGroupChatName("")
    }

    const handleSearch = () => { }



    return (
        <>
            <IconButton onClick={onOpen} icon={<ViewIcon />} d={{ base: 'flex' }} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    >
                        <Box
                            display='flex'
                            w='100%'
                            flexWrap="wrap"
                            pb={3}>
                            {selectedChat.users.map(u =>
                                <UserbadgeItem key={user._id} user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            )}
                        </Box>
                        <FormControl display='flex'>
                            <Input placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='add user to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button Color='Red' mr={3} onClick={handleRemove(user)}>
                            Leave group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal