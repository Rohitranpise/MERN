import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Toast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [pic, setPic] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useToast();
    const navigate = useNavigate()

    const handleClick = () => {
        setShow(!show)
    }

    const postDetails = async (selectedFile) => {
        setLoading(true)
        if (selectedFile === undefined) {
            toast({
                title: 'please select an image',
                description: "warning",
                status: 'success',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            });
            return;
        }

        if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
            const data = new FormData()
            data.append("file", selectedFile)
            data.append("upload_preset", "ml_default")
            data.append("cloud_name", "dzzyvnoke")
            await axios.post("https://api.cloudinary.com/v1_1/dzzyvnoke/image/upload", data)
                .then((res) => {
                    console.log(res.data.url)
                    return res;
                })
                .then(res => {
                    setPic(res.data.url.toString())
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                })
        } else {
            toast({
                title: 'please select an image',
                description: "warning",
                status: 'success',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            });
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'please fill all the details',
                status: 'warning',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            })
            setLoading(false)
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            })
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("http://localhost:2000/user",
                { name, email, password, pic },
                config
            );
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                position: 'bottom',
                isClosable: true,
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false)
            navigate("/chats")

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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : 'password'}
                        placeholder='confirm password'
                        onChange={(e) => setConfirmpassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: "15" }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup