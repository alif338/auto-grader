import { 
  Box, 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Container, 
  Flex, 
  Heading, 
  SimpleGrid, 
  Spacer, 
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  UnorderedList,
  ListItem,
  Divider,
  OrderedList,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react';
import background from '../assets/image/exam-creator-bg.jpg'
import { Link } from 'react-router-dom';

import { supabase } from '../supabaseClient'

export function DashboardExamCreator() {
  const toast = useToast()
  const [exams, setExams] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [examCode, setExamCode] = useState(null)

  useEffect(() => {
    const creator = localStorage.getItem('creator')
    const creatorPassword = localStorage.getItem('creator-password')
    if (creator != import.meta.env.VITE_CREATOR_USERNAME || creatorPassword != import.meta.env.VITE_CREATOR_PASSWORD) {
      window.location.href = '/'
    }
    fetchExams()
  }, [])

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
    if (error) {
      console.log(error)
    } else {
      setExams(data)
    }
  }

  const deleteExam = async () => {
    const { data, error } = await supabase
      .from('questions')
      .delete()
      .match({ exam_code: examCode })
    if (error) {
      toast({
        title: 'Error',
        description: 'Error deleting exam',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
    toast({
      title: 'Success',
      description: 'Exam deleted successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    onClose()
    fetchExams()
  }

  const logout = () => {
    localStorage.removeItem('creator')
    localStorage.removeItem('creator-password')
    window.location.href = '/'
  }

  return (
    <>
      <Container
        maxW={'100vw'}
        backgroundImage={background}
        padding={'0'}
      >
        <Flex
          backgroundColor={"rgba(255, 255, 255, 0.87)"}
          padding={'8'}
          w={'100vw'}
          boxShadow={'lg'}
          alignItems={'center'}
        >
          <Heading
            as="h1"
            size="xl"
          >
            Exam Creator
          </Heading>
          <Box w={'4'} />
          <Link to={'/exam-creator/create'}>
            <Button colorScheme="blue"><AddIcon/> <Box w={'2'} />New Exam</Button>
          </Link>
          <Spacer />
          <Button colorScheme="gray" onClick={logout}>Logout</Button>
        </Flex>

        <Container
          maxW={'100%'}
          padding={'0'}
          margin={'0'}
          minH={'100vh'}
        >
          <SimpleGrid 
            templateColumns='repeat(4, 1fr)' 
            gap={6}
            paddingX={'16'}
            paddingY={'8'}
            paddingBottom={'20'}
          >
            {exams.length == 0 
            ? <Text>There is no exam yet</Text>
            : exams.map((exam, index) => <CardProblem 
              data={exam} 
              key={exam.exam_code} 
              onDelete={() => {
                setExamCode(exam.exam_code)
                onOpen()
              }}/>
            )}
          </SimpleGrid>
        </Container>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure to delete this exam with code <Text fontWeight={'bold'}>{examCode}?</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant='ghost' colorScheme={'red'} onClick={deleteExam}>Yes, Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function CardProblem(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Card
        backgroundColor={"rgba(255, 255, 255,1)"}
      >
        <CardHeader>
          <Heading size='md'>{props.data.title}</Heading>
        </CardHeader>
        <CardBody>
          <Text size='sm' fontWeight={'bold'}>Created by: {props.data.creator}</Text> <br />
          <Text>{props.data.description}</Text><br />
          <Text size='sm'>Exam Code: {props.data.exam_code}</Text>
        </CardBody>
        <CardFooter>
          <Button colorScheme={'teal'} onClick={onOpen}><ViewIcon/></Button>
          <Box w={'3'}/>
          <Button colorScheme={'red'} onClick={props.onDelete}><DeleteIcon /></Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Exam Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList>
              <ListItem>Title: <strong>{props.data.title}</strong></ListItem>
              <ListItem>Created by: <strong>{props.data.creator }</strong></ListItem>
              <ListItem>Description: <Text>{props.data.description}</Text></ListItem>
            </UnorderedList>
            <Divider marginY={'2'} />
            <OrderedList>
              {props.data.questions.map((question, index) => {
                return <ListItem key={index} marginBottom={'6'}>
                  <strong>Question:</strong>
                  <Text>{question}</Text>
                  <strong>Answer Key:</strong>
                  <Text>{props.data.answers[index]}</Text>
                </ListItem>
              })}
            </OrderedList>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}