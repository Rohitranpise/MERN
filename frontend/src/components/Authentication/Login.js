import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast
}
    from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => {
        setShow(false)
    }


    const submitHandler = async () => {
        setShow(!show)
        if (!email || !password) {
            toast({
                title: "please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("http://localhost:2000/user/login",
                { email, password },
                config
            );
            toast({
                title: "Login success",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem('userInfo', JSON.stringify((data)))
            setLoading(false)
            navigate("/chats")
            return;
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            })
            setLoading(false)
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input value={email} placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input value={password} type={show ? "text" : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: "15" }}
                onClick={submitHandler}
            >
                Log in
            </Button>
            <Button
                variant="solid"
                colorScheme='red'
                width="100%"
                onClick={() => {
                    setEmail("guest@gmail.com")
                    setPassword("12345")
                }}
                isLoading={loading}
            >
                Get guest user details
            </Button>
        </VStack>
    )
}

export default Login