import React from "react"
import ThemeProvider from "@chakra-ui/core/dist/ThemeProvider"
import theme from "./theme"
import { Box } from "@chakra-ui/core"
import "src/styles/global.sass"

export default class GlobalWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
  }
  render() {
    return (
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <Box
            fontFamily="body"
            color={theme.colors.text.default}
            fontSize="xl"
            className="root"
          >
            {this.props.children}
          </Box>
        </ThemeProvider>
      </React.StrictMode>
    )
  }
}
