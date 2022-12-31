import { 
  Button, 
  Center, 
  Container, 
  Heading, 
  FormControl,
  Box,
  useToast,
  Text,
  VStack,
  HStack,
  Spacer,
  Textarea,
  CircularProgress
} from "@chakra-ui/react";
import React, {useEffect, useState} from 'react';
import { generateCompletion } from "../../logic/script";
import background from '../assets/image/participant-bg.jpg'
import { supabase } from '../supabaseClient'

export function DashboardParticipant() {
  const toast = useToast()
  const [exam, setExam] = useState({})
  const [testMode, setTestMode] = useState(false)

  const fetchQuestion = async () => {
    const getCode = localStorage.getItem('exam_code')
    const tempExam = JSON.parse(localStorage.getItem('exam'))
    if (tempExam) {
      console.log(tempExam)
      setExam(tempExam)
      return
    }
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_code', getCode)
    if (error || data.length == 0) {
      toast({
        title: "Error",
        description: "Exam with code "+getCode+" not found",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
      return
    } else {
      setExam(data[0])
      localStorage.setItem('exam', JSON.stringify(data[0]))
    }
  }

  const logout = () => {
    localStorage.removeItem('name')
    localStorage.removeItem('exam_code')
    localStorage.removeItem('exam')
    window.location.href = '/'
  }

  useEffect(() => {
    fetchQuestion()
  }, [0])

  return (
    <Center
      w="100vw"
      h={testMode ? "100%" :"100vh"}
      backgroundColor={"rgba(255, 255, 255, 0.87)"}
      backgroundImage={background}
    >
      {testMode ? <TestMode exam={exam} /> 
      : <Container
          backgroundColor={"rgba(255, 255, 255, 1)"}
          padding={'6'}
          borderRadius={'lg'}
          boxShadow={'lg'}
          borderTop={'6px solid teal'}
        >
          <HStack alignItems={'flex-start'}>
            <Heading as="h1" size="xl" marginBottom={'12'}>{exam.title}</Heading>
            <Spacer />
            <Button colorScheme={'teal'} variant='outline' onClick={logout}>Logout</Button>
          </HStack>
          <Heading as="h2" size="sm" marginBottom={'2'}>Participant Name: {localStorage.getItem('name')}</Heading>
          <Heading as="h2" size="sm" marginBottom={'2'}>Exam Code: {localStorage.getItem('exam_code')}</Heading>
          <Heading as="h2" size="sm" marginBottom={'2'}>Description:</Heading>
          <Text marginBottom={'6'}>{exam.description}</Text>
          <Button colorScheme="teal" onClick={() => setTestMode(true)}>Start Exam</Button>
        </Container>}
    </Center>
  )
}

function TestMode(props) {
  const [answers, setAnswers] = useState(props.exam.questions.map(() => {
    return {
      answer: '',
      isGrading: false,
      grading: ''
    }
  }))

  const doGrading = async () => {
    window.scrollTo(0, 0)
    const answerToGrading = answers.map((answer) => {
      answer.isGrading = true
      answer.grading = ''
      return answer
    })
    setAnswers(answerToGrading)
    const gradedAnswer = [...answers]
    answers.forEach(async (answer, index) => {
      const question = props.exam.questions[index]
      const correctAnswer = props.exam.answers[index]
      const initGrading = 'Yes, it is correct'
      const queryText = `question:${question}\nanswer:${correctAnswer}\ngrading:${initGrading}\nquestion:${question}\nanswer:${answer.answer}\ngrading:`
      const response = await generateCompletion(queryText)
      answer.grading = response

      console.log(answer, response)
      gradedAnswer[index] = answer
      setAnswers([...gradedAnswer])
    })
  }

  const logout = () => {
    localStorage.removeItem('name')
    localStorage.removeItem('exam_code')
    localStorage.removeItem('exam')
    window.location.href = '/'
  }

  return (
    <VStack
      padding={'8'}
      w={'100vw'}
      alignItems={'center'}
      paddingBottom={'20'}
      paddingTop={'20'}
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
        <HStack alignItems={'flex-start'}>
          <Heading as="h1" size="xl" marginBottom={'12'}>{props.exam.title}</Heading>
          <Spacer />
          <Button colorScheme={'teal'} variant='outline' onClick={logout}>Logout</Button>
        </HStack>
        <Text marginBottom={'6'}>{props.exam.description}</Text>
      </Container>
      <Box h={'2'} />
      {props.exam.questions.map((question, index) => {
        return <AnswerForm 
          key={index} 
          noQuestion={index} 
          valueQuestion={question} 
          onChangeAnswer={(value) => {
            answers[index].answer = value
            setAnswers(answers)
          }}
          result={answers[index]}
        />  
      })}
      <Button colorScheme={'teal'} onClick={doGrading}>Submit</Button>
    </VStack>
  )
}

function AnswerForm(props) {
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
            </HStack>
            <Box h={'4'} />
            <Text>{props.valueQuestion}</Text>
            <Box h={'4'} />
            <Textarea placeholder="Answer here ..." isRequired={true} onChange={e => props.onChangeAnswer(e.target.value)} />
            <Box h={'4'} />
            {!props.result.isGrading && props.result.grading == '' 
              ? <></>
              : <>
                  <Text>Grading</Text>
                  {props.result.grading == '' 
                    ? <CircularProgress isIndeterminate color='teal.300' /> 
                    : <Textarea 
                        value={props.result.grading} 
                        readOnly={true} 
                        background={props.result.grading.toLowerCase().includes('no') ? 'red.100' : 'green.100'}
                      />
                  }
                </>}
          </FormControl>
        </Container>
      <Box h={'1'} />
    </>
  )
}