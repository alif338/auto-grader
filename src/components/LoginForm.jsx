import { 
  Button, 
  Center, 
  Container, 
  Heading, 
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast
} from "@chakra-ui/react";
import React, {useMemo, useState} from 'react';
import { useLocation } from "react-router-dom";
import background from '../assets/image/login-bg.jpg'

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const query = useQuery()
  const toast = useToast()

  const doLogin = async () => {
    if (username === '' || password === '') {
      toast({
        title: "Error",
        description: query.get('exam-creator') ? "Username and Password cannot be empty" : "Your Name and Exam Code cannot be empty",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      return
    }
    if (query.get('type') === 'participant') {
      // do login participant
      localStorage.setItem('name', username)
      localStorage.setItem('exam_code', password)
      window.location.href = '/participant'
    } else if (query.get('type') === 'exam-creator') {
      // do login exam creator
      if (username !== import.meta.env.VITE_CREATOR_USERNAME || password !== import.meta.env.VITE_CREATOR_PASSWORD) {
        toast({
          title: "Error",
          description: "Invalid Username or Password",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
        return
      }
      localStorage.setItem('creator', username)
      localStorage.setItem('creator-password', password)
      window.location.href = '/exam-creator'
    } else {
      toast({
        title: "Error",
        description: `Unknown Login Type "${query.get('type')}"`,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Center
      h="100vh"
      w="100vw"
      backgroundColor={"rgba(255, 255, 255, 0.87)"}
      backgroundImage={background}
    >
      <Container
        centerContent
        backgroundColor={"rgba(255, 255, 255, 0.87)"}
        padding={'6'}
        borderRadius={'lg'}
        boxShadow={'lg'}
      >
        <Heading as="h1" size="xl" marginBottom={'12'}>Sign In as {query.get('type').toLocaleUpperCase()}</Heading>
        <FormControl>
          <FormLabel>{query.get('type') == 'exam-creator' ? 'Username' : 'Your Name'} </FormLabel>
          <Input 
            type={'text'} 
            isRequired={true} 
            onChange={e => setUsername(e.target.value)}
            placeholder={query.get('type') == 'exam-creator' ? 'exam-creator' : ""}
          />
          <Box height={'4'} />
          <FormLabel>{query.get('type') == 'exam-creator' ? 'Password' : 'Exam Code'}</FormLabel>
          <Input 
            type={query.get('type') == 'exam-creator' ? 'password' : 'text'} 
            isRequired={true} 
            onChange={e => setPassword(e.target.value)}
            placeholder={query.get('type') == 'exam-creator' ? 'exam-creator' : ""}
          />
          <Box height={'12'} />
          <Button colorScheme="teal" type="submit" onClick={doLogin}>Sign In</Button>
        </FormControl>
      </Container>
    </Center>
  )
}

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}