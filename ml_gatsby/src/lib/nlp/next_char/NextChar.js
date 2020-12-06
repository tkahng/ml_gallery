import { Centered } from "../../components/commons"
import { ProjectWrapper } from "../../components/ProjectWrapper"
import React from "react"
import { Box, Flex, Input, Text } from "@chakra-ui/core"
import { projects } from "src/lib/globals/data"
import { mlgApi } from "src/lib/api"

export class NextChar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
      predicted: "... Enter text here!",
      history: [],
    }
    this.project = projects.next_char
    this.history_max_len = 10
  }

  handleInput(event) {
    const text = event.target.value
    this.setState({ text })
    if (!text) this.setState({ predicted: "... Enter text here!" })
    else
      mlgApi
        .nextChar(text)
        .then(res => res.json())
        .then(result => {
          this.setState({ predicted: result.pred })
          this.enqueue(text, result.pred)
        })
    // TODO: Dude, if entered text goes far, then set negative margin to the placeholder or something
  }

  render() {
    return (
      <ProjectWrapper project={this.project}>
        <Centered>
          <Box width="4xl" height={{ base: "75px", md: "120px" }} mt={4}>
            <Input
              size="lg"
              height={{ base: "70px", md: "100px" }}
              fontSize={{ base: "xl", md: "5xl" }}
              focusBorderColor="red.400"
              backgroundColor="transparent"
              onChange={event => this.handleInput(event)}
            />
            <Text
              fontSize={{ base: "xl", md: "5xl" }}
              color="gray.300"
              mt={{ base: "-35px", md: "-85px" }}
              textAlign="left"
              ml={4}
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {`${this.state.text}${this.state.predicted}`}
            </Text>
          </Box>
          <Box width="4xl" overflowY="auto" maxH="150px">
            {this.state.history.reverse().map(history => (
              <Flex whiteSpace="pre">
                <Text>{history.text}</Text>
                <Text color="gray.400">{`${history.predicted}`}</Text>
              </Flex>
            ))}
          </Box>
        </Centered>
      </ProjectWrapper>
    )
  }

  enqueue = async (text, predicted) => {
    const hist = this.state.history
    if (hist.length >= this.history_max_len) {
      hist.shift()
    }
    hist.push({ text, predicted })
    this.setState({ history: hist })
  }
}
