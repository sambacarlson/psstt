import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Avatar,
  HStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { CgDarkMode } from "react-icons/cg";
import axios from "axios";
import Image from "next/image";

export default function WithSubnavigation({ children }) {
  const { isOpen, onToggle } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const session = useSession();


  const signout = () => {
    axios
      .get("/api/dailyCheck")
      .then((res) => {
        console.log('response from signing out: ', res)
        signOut()
      })
      .catch((err) => console.log(err))
  }
  return (
    <Box >
      <HStack mx={5} my={2} justifyContent={'space-between'}>
        {/* <IconButton
          variant="unstyled"
          onClick={toggleColorMode}
          icon={<Icon as={CgDarkMode} />}
          fontSize="xx-large"
          mt="-10px"
        /> */}
        <Image src={require('../../assets/logo.png')} width={80} height={30} />
        <HStack  justifyContent={'flex-end'} w={'50%'} columnGap={20}>
          <Button variant="link" color={"#5AD8C4"}>Home</Button>
          <Button variant="link"  disabled>How it works</Button>
          {session?.data ? (
            <>
              <Button
                fontSize={"sm"}
                fontWeight={400}
                color={"#5AD8C4"}
                variant="outline"
                borderRadius={'3xl'}
                href={"#"}
                borderWidth={1}
                borderColor={"#5AD8C4"}
                onClick={signout}
              >
                Sign Out
              </Button>
              <Link href="/">
                <a>
                  <Avatar
                    size="lg"
                    name={session?.data?.user?.name}
                    src={session?.data?.user?.image}
                  />
                </a>
              </Link>
            </>
          ) : (
            <Button
              fontSize={"sm"}
              fontWeight={400}
              color={"#5AD8C4"}
              variant="outline"
              borderRadius={'3xl'}
              href={"#"}
              borderWidth={1}
              borderColor={"#5AD8C4"}
              onClick={() => signIn('google')}
            >
              Sign In
            </Button>
          )}

        </HStack>
      </HStack>

      {children}
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            {/* <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger> */}

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Find Work",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Learn Design",
    href: "#",
  },
  {
    label: "Hire Designers",
    href: "#",
  },
];
