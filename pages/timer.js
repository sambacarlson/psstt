import React, { useState, useRef, useEffect } from "react";

import { VStack, useColorModeValue, Text, Button } from "@chakra-ui/react";

import { useRouter } from "next/router";
import CompoundTimer from "react-compound-timer";
import axios from "axios";

export default function Timer() {
  const router = useRouter();
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [submitIng, setSubmitIng] = useState(false);

  const task = JSON.parse(router?.query?.tag)

  const submitTagTimer = () => {
    timerRef.current.stop
    const updatedTask = {
      ...task,
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
      router.push('/')
    }
    )
  };

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (timerRef.current.getTime()) return "Do you want to lose this time?";
    };
  }, []);
  return (
    <VStack
      w="400px"
      maxW="100%"
      mx="auto"
      alignItems="left"
      role={"group"}
      p={6}
      maxW={"330px"}
      w={"full"}
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
              variant="solid"
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
            {/* <div>
              <button onClick={start}>Start</button>
              <button onClick={pause}>Pause</button>
              <button onClick={resume}>Resume</button>
              <button onClick={stop}>Stop</button>
              <button onClick={reset}>Reset</button>
            </div> */}
          </React.Fragment>
        )}
      </CompoundTimer>

      <Button
        mt={10}
        w={"full"}
        bg={"green.400"}
        color={"white"}
        rounded={"xl"}
        boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
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
