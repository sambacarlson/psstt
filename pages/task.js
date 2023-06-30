import { useState, useEffect } from "react";
import { VStack, Button, Heading, LightMode, Input, Text, HStack } from "@chakra-ui/react";
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
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(1);
  const session = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   axios
  //     .get("/api/tag")
  //     .then((res) => setTags(res.data))
  //     .catch((err) => {
  //       console.log(err)
  //       alert(err?.response?.data || "Internal Server Error :)");
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  // const createTag = (tag) => {
  //   setLoading(true);
  //   axios
  //     .post("/api/tag", { tag })
  //     .then((res) => {
  //       setTags([...tags, tag]);
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => setLoading(false));
  // };

  const createTask = () => {
    let task = {
      dailyCheckId: session?.data?.dailyCheckId,
      name: taskName,
      description,
      estimatedTime: (hours * 1 * 60) + (minutes * 1)
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
      alignItems="left"
      p={2}
      mt={3}
      width="400px"
      maxWidth="100%"
      mx="auto"
    >
      <Heading as="h1" size="sm">
        {" "}
        Create a task
      </Heading>


      <>
        <Text>Task name</Text>
        <Input placeholder="Task name" onChange={(e) => setTaskName(e.target.value)} />
      </>

      <>
        <Text>Description</Text>
        <Input placeholder="Task description" onChange={(e) => setDescription(e.target.value)} size="lg" />
      </>

      <>
        <Text>Estimated time (in hours)</Text>
        <HStack spacing={15}>
          <HStack>
            <Input w={'20'} type="number" onChange={(e) => setHours(e.target.value)} />
            <Text>Hours</Text>
          </HStack>
          <Text> : </Text>
          <Input w={'20'} type="number" onChange={(e) => setMinutes(e.target.value)} />
          <Text>Minutes</Text>
        </HStack>
      </>
      {/* <Link href={`/timer?tag=${selectedTag?.value}`}> */}
      <a>
        <Button
          isFullWidth
          colorScheme="green"
          variant="solid"
          // disabled={!selectedTag}
          size="sm"
          onClick={createTask}
        >
          GO
        </Button>
      </a>
      {/* </Link> */}
      {/* <Link href={`/back-date?tag=${selectedTag?.value}`}> */}
      <a>
        <Button
          isFullWidth
          colorScheme="green"
          variant="outline"
        // disabled={!selectedTag}
        >
          Back Date
        </Button>
      </a>
      {/* </Link> */}
    </VStack>
  );
}
