import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Divider, Flex, FormControl, Heading, HStack, Input, Spacer, Textarea, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import background from '../assets/image/exam-creator-bg.jpg'
import { supabase } from '../supabaseClient'

export function CreateExam() {
  const toast = useToast()
  const [questions, setQuestions] = useState([''])
  const [answers, setAnswers] = useState([''])
  const [examTitle, setExamTitle] = useState('')
  const [examDescription, setExamDescription] = useState('')
  const [creator, setCreator] = useState('')

  useEffect(() => {
    const creator = localStorage.getItem('creator')
    const creatorPassword = localStorage.getItem('creator-password')
    if (creator != import.meta.env.VITE_CREATOR_USERNAME || creatorPassword != import.meta.env.VITE_CREATOR_PASSWORD) {
      window.location.href = '/'
    }
  },[])

  const addQuestion = () => {
    setQuestions([...questions, ''])
    setAnswers([...answers, ''])
  }

  const onSubmit = async () => {
    const examCode = 'EX_'+crypto.randomUUID().substring(0, 6).toUpperCase()
    console.log(examCode)
    if (examTitle === '' || examDescription === '' || creator === '') {
      toast({
        title: 'Error',
        description: 'Creator, Title, and Description are required',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!questions.every(q => q !== '') || !answers.every(a => a !== '')) {
      toast({
        title: 'Error',
        description: 'Questions/Answers cannot be empty',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          exam_code: examCode,
          creator: creator,
          title: examTitle,
          description: examDescription,
          questions: questions,
          answers: answers,
        }
      ])
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    } else {
      toast({
        title: 'Success',
        description: 'Exam Created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setTimeout(() => {
        window.location.href = '/exam-creator'
      },1000)
    }
  }

  return (
    <Container
      maxW={'100vw'}
      backgroundImage={background}
      padding={'0'}
    >
      <Flex
        position={'fixed'}
        zIndex={'199'}
        backgroundColor={"rgba(255, 255, 255, 1)"}
        padding={'8'}
        w={'100vw'}
        boxShadow={'lg'}
        alignItems={'center'}
      >
        <Heading
          as="h2"
          size="lg"
        >
          Create New Exam
        </Heading>
        <Spacer />
        <Link to={'/exam-creator'} replace={true}>
          <Button colorScheme="blue" variant={'outline'}>Cancel</Button>
        </Link>
        <Box w={'4'} />
        <Button colorScheme="blue" onClick={onSubmit}>Submit</Button>
      </Flex>

      <VStack
        padding={'8'}
        w={'100vw'}
        alignItems={'center'}
        paddingBottom={'20'}
        paddingTop={'32'}
      >
        <Container
          backgroundColor={"rgba(255, 255, 255, 0.87)"}
          padding={'6'}
          w={'100%'}
          borderRadius={'lg'}
          boxShadow={'lg'}
          borderTop={'8px'}
          borderColor={'teal.400'}
        >
          <FormControl>
            <Input placeholder="Creator*" isRequired={true} onChange={e => setCreator(e.target.value)}/>
            <Box h={'4'} />
            <Input placeholder="Title*" isRequired={true} onChange={e => setExamTitle(e.target.value)}/>
            <Box h={'4'} />
            <Textarea placeholder="Description*" isRequired={true} onChange={e => setExamDescription(e.target.value)}/>
          </FormControl>
        </Container>
        <Box h={'2'} />
        <Container
          backgroundColor={"rgba(255, 255, 255, 0.87)"}
          padding={'6'}
          w={'100%'}
          borderRadius={'lg'}
          boxShadow={'lg'}
        >
          <Heading as="h3" size="md">Exam Problems Below</Heading>
        </Container>
        <Box h={'2'} />
        {questions.map((question, index) => {
          return (
            <QnA 
              key={index} 
              noQuestion={index}
              onRemove={() => {
                questions.splice(index, 1)
                answers.splice(index, 1)
                setQuestions([...questions])
                setAnswers([...answers])
              }} 
              onChangeQuestion={(val) => {
                questions[index] = val
                setQuestions([...questions])
              }}
              onChangeAnswer={(val) => {
                answers[index] = val
                setAnswers([...answers])
              }}
              valueQuestion={question}
              valueAnswer={answers[index]}
            />
          )
        })}
        <Button colorScheme="teal" variant={'outline'} onClick={addQuestion}>Add Question</Button>
      </VStack>

    </Container>
  )
}

function QnA(props) {
  return (
    <>
      <Container
        backgroundColor={"rgba(255, 255, 255, 0.87)"}
        padding={'6'}
        w={'100%'}
        borderRadius={'lg'}
        boxShadow={'lg'}
        >
          <FormControl>
            <HStack>
              <Heading as="h4" size="sm">Question {props.noQuestion + 1}</Heading>  
              <Spacer />
              {props.noQuestion > 0 ? <Button colorScheme="red" variant={'outline'} onClick={props.onRemove}><DeleteIcon/></Button> : <></>}
            </HStack>
            <Box h={'4'} />
            <Input placeholder="Question" value={props.valueQuestion} isRequired={true} onChange={e => props.onChangeQuestion(e.target.value)}/>
            <Box h={'4'} />
            <Textarea placeholder="Answer" value={props.valueAnswer} isRequired={true} onChange={e => props.onChangeAnswer(e.target.value)} />
            <Box h={'4'} />
          </FormControl>
        </Container>
        <Box h={'1'} />
      </>
  )  
}