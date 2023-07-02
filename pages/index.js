import { useEffect, useState } from "react";
import Hero from "components/layout/Hero";
import Aday from "@components/chart/Aday";
import { VStack, Input, Box, Text, Button, Center, HStack } from "@chakra-ui/react";

import { to_YY_MM_DD } from "../lib/util";
import axios from "axios";
import useRandomInterval from "./randomInterval";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  let curDate = new Date();
  const [date, setDate] = useState(to_YY_MM_DD(new Date()));
  const session = useSession();

  // const takeScreenshot = async () => {
  //   axios.get('/api/screenshot').then(res => {
  //     console.log('response data: ', res.data)
  //   })
  // }


  // useRandomInterval(() => takeScreenshot(), 15000, 30000)

  return (
    <Box>
      {
        session?.data ?
          <Box w={'100vw'} height={'80vh'} >
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={to_YY_MM_DD(new Date())}
              w="200px"
              mb={10}
            />
            <Aday date={date} />
            <HStack justifyContent={'space-between'} p={5}>
              <HStack>
                <Link href={'/task'}><Button color={'black'} backgroundColor={'#5AD8C4'} size={'lg'} borderRadius={'3xl'}>Start tracking</Button></Link>
                {session?.data?.user?.isAdmin && <Link href={'/analytics-360'}><Button color={'black'} backgroundColor={'#5AD8C4'} size={'lg'} borderRadius={'3xl'}>Analytics</Button></Link>}
              </HStack>
              <Image src={require('../assets/home.png')} width={200} height={200} />
            </HStack>
          </Box>
          :
          <Box w={'100vw'} height={'80vh'}>
            <Image src={require('../assets/image-bg.jpg')} style={{ zIndex: -9999, opacity: 0.6 }} height={2400} />
            <Box alignItems={'center'} flex={1} p={4} pt={'20vh'} w={'45%'} rowGap={18} position={'absolute'} top={'10vh'}>
              <Box rowGap={20} my={12}>
                <Text fontSize={'5xl'} color={'#5AD8C4'}>Manage all of your work in one place effectively</Text>
                <Text>Mange your work, timeline, and employees all at once!</Text>
              </Box >
              <Box>
                <Button color={'black'} backgroundColor={'#5AD8C4'} borderRadius={'3xl'}>Get started</Button>
              </Box>
            </Box >
          </Box>
      }
    </Box >
  );
}
