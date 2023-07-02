import React, { useState, useRef, useEffect } from "react";

import { VStack, useColorModeValue, Text, Button } from "@chakra-ui/react";

import { useRouter } from "next/router";
import CompoundTimer from "react-compound-timer";
import axios from "axios";
import { useSession } from "next-auth/react";
import useRandomInterval from "./randomInterval";

export default function Timer() {
  const router = useRouter();
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [submitIng, setSubmitIng] = useState(false);
  const session = useSession();

  const task = JSON.parse(router?.query?.tag)


  useEffect(() => {
    if (!session?.data?.user) {
      router.push('/401')
    }
  }, [])
  const submitTagTimer = () => {
    timerRef.current.stop
    const updatedTask = {
      ...task,
      status: 'closed',
      finishTime: task.startTime + Math.round(timerRef.current.getTime())
    }

    setSubmitIng(true)

    // console.log('updated task: ', updatedTask)
    console.log('updating task...........')
    axios.post(`/api/tag?id=${task._id}`, {
      updatedTask
    }).then(res => {
      console.log('response data: ', res.data)
    }).finally(() => {
      setSubmitIng(false)
      router.push('/task')
    }
    )
  };

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (timerRef.current.getTime() || paused) {
        console.log('timer ref: ', timerRef.current.getTime())
        return "Do you want to lose this time?";
      }
    };
  }, [paused]);

  const takeScreenshot = async () => {
    axios.get('/api/screenshot').then(res => {
      console.log('response data: ', res.data)
    })
  }


  useRandomInterval(() => !paused && takeScreenshot(), 1000 * 60 * 30, 10000 * 60 * 45)

  return (
    <VStack
      w="400px"
      mx="auto"
      alignItems="left"
      role={"group"}
      p={6}
      maxW={"330px"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      pos={"relative"}
      zIndex={1}
    >
      <CompoundTimer ref={timerRef} initialTime={0}>
        {({ start, resume, pause, stop, reset, timerState }) => (
          <React.Fragment>
            <Text
              className={paused ? "blink_timer" : ""}
              fontSize="50px"
              textAlign="center"
            >
              <CompoundTimer.Hours /> : <CompoundTimer.Minutes /> :{" "}
              <CompoundTimer.Seconds />
            </Text>
            <Button
              w="auto"
              variant="outline"
              borderColor={'#5AD8C4'}
              borderWidth={1}
              borderRadius={'3xl'}
              color="black"
              mx="auto"
              onClick={() => {
                paused ? resume() : pause();
                setPaused(!paused);
              }}
              size="lg"
              variant="unstyles"
            >
              {paused ? "▶️" : "⏸️"}
            </Button>
          </React.Fragment>
        )}
      </CompoundTimer>

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
        onClick={submitTagTimer}
        isLoading={submitIng}
      >
        Save for {task?.name}
      </Button>
    </VStack>
  );
}
