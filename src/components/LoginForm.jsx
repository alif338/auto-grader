import { 
  Button, 
  Center, 
  Container, 
  Heading, 
  HStack, 
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Spacer,
  Box,
  useToast
} from "@chakra-ui/react";
import React, {useMemo, useState} from 'react';
import { useLocation } from "react-router-dom";
import background from '../assets/image/login-bg.jpg'

export function LoginForm(props) {
  const [isLogin, setIsLogin] = useState(false);
  const query = useQuery()
  const toast = useToast()

  const doLogin = () => {
    if (query.get('type') === 'participant') {
      // do login participant
    } else if (query.get('type') === 'exam-creator') {
      // do login exam creator
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
        <Heading as="h1" size="xl" marginBottom={'12'}>Masuk Sebagai {query.get('type').toLocaleUpperCase()}</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input type='email' isRequired={true}/>
          <FormHelperText>We'll never share your username.</FormHelperText>

          <FormLabel>Password</FormLabel>
          <Input type='password' isRequired={true}/>
          <FormHelperText>We'll never share your password.</FormHelperText>
          <Box height={'12'} />
          <Button colorScheme="teal" type="submit" onClick={doLogin}>Masuk</Button>
        </FormControl>
      </Container>
    </Center>
  )
}

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}