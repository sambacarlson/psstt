import { useState, useEffect } from "react";
import { VStack, Button, Heading, LightMode, Input, Text, HStack, Center, useColorModeValue } from "@chakra-ui/react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",
  color: "white",
  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export default function Tags() {
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(1);
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.data?.user) {
      router.push('/401')
    }
  }, [])

  const createTask = () => {
    let task = {
      dailyCheckId: session?.data?.dailyCheckId,
      name: taskName,
      description,
      estimatedTime: (hours * 1 * 60) + (minutes * 1),
    }
    setLoading(true)
    axios.post('/api/tag', {
      task
    }).then(res => {
      console.log('response data: ', res.data)
      router.push(`/timer/?tag=${JSON.stringify(res.data)}`)
    }).finally(setLoading(false))
  }
  return (
    <VStack
      w="400px"
      // maxW="100%"
      mx="auto"
      alignItems="left"
      role={"group"}
      p={6}
      maxW={"420px"}
      // w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      pos={"relative"}
      zIndex={1}
    >
      <Center>
        <Heading as="h1" size="lg" color={'#5AD8C4'}>
          {" "}
          Create a task
        </Heading>
      </Center>


      <>
        <Text>Task name</Text>
        <Input placeholder="Task name" onChange={(e) => setTaskName(e.target.value)} borderColor={'#5AD8C4'}/>
      </>

      <>
        <Text>Description</Text>
        <Input placeholder="Task description" onChange={(e) => setDescription(e.target.value)} size="lg" borderColor={'#5AD8C4'}/>
      </>

      <>
        <Text>Estimated time (in hours)</Text>
        <HStack spacing={15}>
          <HStack>
            <Input w={'20'} type="number" onChange={(e) => setHours(e.target.value)} borderColor={'#5AD8C4'}/>
            <Text>Hours</Text>
          </HStack>
          <Text> : </Text>
          <Input w={'20'} type="number" onChange={(e) => setMinutes(e.target.value)} borderColor={'#5AD8C4'} />
          <Text>Minutes</Text>
        </HStack>
      </>
      {/* <Link href={`/timer?tag=${selectedTag?.value}`}> */}
      <a>
        <Button
          isFullWidth
          bgColor={'#5AD8C4'}
          color="black"
          variant="solid"
          // disabled={!selectedTag}
          size="sm"
          onClick={createTask}
          borderRadius={'3xl'}
        >
          GO
        </Button>
      </a>
      {/* </Link> */}
      <Link href={`/back-date`}>
        <a>
          <Button
            isFullWidth
            variant="outline"
            borderRadius={'3xl'}
            borderWidth={1}
            borderColor={'#5AD8C4'}
          // disabled={!selectedTag}
          >
            Input manually
          </Button>
        </a>
      </Link>
    </VStack>
  );
}
