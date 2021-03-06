import React from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Tag,
  Image,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as GLink } from "gatsby"
import { categoriesMap, projects, projectStatus } from "../../globals/data"
import { IconLinks } from "./commons"

const RightSection = () => {
  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "50%" }}
      p={{ base: 8, md: "100px" }}
      justify="center"
    >
      <Box>
        <Heading variant="dynamicColorMode">The Basics</Heading>
        <Text my={2}>
          Start your Deep Learning journey with simple problems
        </Text>
        <Flex my={2}>
          <Tag mr={2}>Regression</Tag>
          <Tag>Classification</Tag>
        </Flex>
        <Button
          my={2}
          size="sm"
          colorScheme="secondary"
          as={GLink}
          to={projects.learn_line.links.app}
        >
          Start with basics
        </Button>
        <Box height={{ base: 0, md: "100px" }} />
      </Box>
    </Flex>
  )
}

const BasicProject = ({ project }) => {
  const bg = useColorModeValue("backgroundColor", "gray.800")
  return (
    <Flex
      backgroundColor={bg}
      m={6}
      borderRadius="14px"
      boxShadow="xl"
      role="group"
      _hover={{
        backgroundColor: "secondary.500",
        transitionDuration: "0.4s",
        color: "white",
      }}
    >
      <Box p={2}>
        <GLink to={project.links.app}>
          <Image
            src={require("../images/" + project.image)}
            alt={project.title + "Image"}
            width="120px"
            height="100px"
            borderRadius="8px"
            minW="50px"
          />
        </GLink>
      </Box>
      <Box p={2}>
        <GLink to={project.links.app}>
          <Heading
            variant="dynamicGray"
            fontSize="lg"
            my={2}
            _groupHover={{ color: "white" }}
          >
            {project.title}
          </Heading>
          <Text
            variant="dynamicColorMode"
            fontSize="sm"
            lineHeight="1"
            _groupHover={{ color: "white" }}
          >
            {project.desc}
          </Text>
        </GLink>
        <IconLinks project={project} />
      </Box>
    </Flex>
  )
}

const LeftSection = () => {
  const projects = categoriesMap.linear.projects.filter(
    project => project.status !== projectStatus.toDo
  )
  const bg = useColorModeValue(
    "linear(to-bl, brand.500, red.500)",
    "linear(to-bl, brand.700, red.700)"
  )
  return (
    <Flex
      borderRightRadius="40px"
      w={{ base: "100%", md: "50%" }}
      justify="flex-end"
      bgGradient={bg}
    >
      <Box w={{ base: "sm", sm: "lg" }} py={6} pr={8}>
        {projects.map(project => (
          <BasicProject project={project} key={project.id} />
        ))}
      </Box>
    </Flex>
  )
}

export const BasicsSection = () => {
  return (
    <Flex direction={{ base: "column", md: "row-reverse" }}>
      <RightSection />
      <LeftSection />
    </Flex>
  )
}
