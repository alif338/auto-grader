import { 
  Button, 
  Center, 
  Container, 
  Heading, 
  HStack, 
} from "@chakra-ui/react";
import React from 'react';
import { Link } from "react-router-dom";
import background from '../assets/image/login-bg.jpg'

export function Login() {

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
        <Heading as="h1" size="xl" marginBottom={'12'}>Auto Grader Exam</Heading>
        <HStack>
          <Link to={`/login?type=exam-creator`}>
            <Button colorScheme="teal">Sign In as Exam Creator</Button>
          </Link>
          <Link to={`/login?type=participant`}>
            <Button>Sign In as Participant</Button>
          </Link>
        </HStack>
      </Container>
    </Center>
  )
}