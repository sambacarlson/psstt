import React, { useState, useRef } from "react";

import {
  VStack,
  useColorModeValue,
  Input,
  Text,
  Button,
  HStack,
  Heading,
  Center,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import axios from "axios";

import { to_YY_MM_DD } from "../lib/util";
import { useSession } from "next-auth/react";

export default function BackDate() {
  const router = useRouter();
  const [submitIng, setSubmitIng] = useState(false);
  const [startTime, setStartTime] = useState();
  const [finishTime, setFinishTime] = useState();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('')
  const session = useSession()

  const createTask = () => {
    console.log('start date, ', new Date(startTime).getTime(), 'finish time: ', new Date(finishTime).getTime())
    let task = {
      dailyCheckId: session?.data?.dailyCheckId,
      name: taskName,
      description,
      estimatedTime: (new Date(finishTime).getTime() - new Date(startTime).getTime()) / (1000 * 60),
      startTime: new Date(startTime).getTime(),
      finishTime: new Date(finishTime).getTime(),
      type: 'manual',
      status: 'closed'
    }
    setSubmitIng(true)
    axios.post('/api/tag', {
      task
    }).then(res => {
      console.log('response data: ', res.data)
      router.push(`/task`)
    }).finally(setSubmitIng(false))
  }

  return (
    <VStack
      // w="400px"
      // maxW="100%"
      mx="auto"
      alignItems="left"
      role={"group"}
      p={6}
      maxW={"420px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      pos={"relative"}
      zIndex={1}
    >
      {/* <Text>Enter time in minutes</Text>
      <Input
        onChange={(e) => setTime(e.target.value)}
        placeholder="minutes"
        ref={minutesInputRef}
        w="100%"
        type="number"
      />
      <Input
        onChange={(e) => setDate(e.target.value)}
        value={date}
        max={to_YY_MM_DD(new Date())}
        w="100%"
        type="date"
      /> */}
      <Center>
        <Heading as="h1" size="lg" color={'#5AD8C4'}>
          {" "}
          Create a task
        </Heading>
      </Center>


      <>
        <Text>Task name</Text>
        <Input placeholder="Task name" onChange={(e) => setTaskName(e.target.value)} borderColor={'#5AD8C4'} />
      </>

      <>
        <Text>Description</Text>
        <Input placeholder="Task description" onChange={(e) => setDescription(e.target.value)} size="lg" borderColor={'#5AD8C4'} />
      </>

      <>
        <Text>Time spent</Text>
        <VStack spacing={15}>
          <HStack>
            <Text>Start</Text>
            <Input w={'30'} type="datetime-local" onChange={(e) => setStartTime(e.target.value)} borderColor={'#5AD8C4'} />
          </HStack>
          <Text></Text>
          <HStack>
            <Text>Finish</Text>
            <Input w={'30'} type="datetime-local" onChange={(e) => setFinishTime(e.target.value)} borderColor={'#5AD8C4'} />
          </HStack>
        </VStack>
      </>
      <Button
        mt={10}
        w={"full"}
        backgroundColor={'#5AD8C4'}
        color="black"
        rounded={"3xl"}
        boxShadow={"0 5px 20px 0px ergb(72 187 120 / 43%)"}
        _hover={{
          bg: "green.500",
        }}
        _focus={{
          bg: "green.500",
        }}
        onClick={createTask}
        isLoading={submitIng}
        disabled={!finishTime}
      >
        Save task
      </Button>
    </VStack>
  );
}
